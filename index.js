#!/usr/bin/env node

const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const os = require('os');
const pk = require('./package.json');

class FoxEnv {

    constructor() {

        // Local storage
        this.local = `${os.homedir()}/.config/fox-env`;

        // Local settings
        this.settings = {
            currentEnv: null
        };

        // Files and folders to save
        this.plan = [
            { path: `${os.homedir()}/.ssh`, cleanable: true },
            { path: `${os.homedir()}/.bash_history`, cleanable: true },
            { path: `${os.homedir()}/.profile`, cleanable: false },
            { path: `${os.homedir()}/.bashrc`, cleanable: false },
            { path: `${os.homedir()}/.bash_logout`, cleanable: false },
            { path: `${os.homedir()}/.bash_profile`, cleanable: false },
            { path: `${os.homedir()}/.gitconfig`, cleanable: true },
        ];

        // Create local settings directory if is not found
        if(!fs.existsSync(this.local))
            fs.mkdirSync(this.local, { recursive: true });

        // Load settings
        this.loadSettings()

        // Initialize all
        .then(() => this.init())

        // Finish app
        .then(() => this.destructor())

        // Catch any error
        .catch(e => console.log(`Error: ${e.message}`))
    }

    async destructor() {
        return this.saveSettings();
    }

    async init () {
        // Show header
        console.log(`Fox Environment Switcher v${pk.version}`);

        // Get argv from CLI
        const argv = process.argv.slice(2);
        const [ action, name ] = argv;

        // Locate paths
        this.paths = {
            ssh: `${os.homedir()}/.ssh`,
            gitconfig: `${os.homedir()}/.gitconfig`
        };

        // Show help
        if(action === 'clear')
            return this.clear();

        else if((action === 'create') && (name !== undefined) && name.length)
            return this.create(name);

        else if(action === 'save')
            return this.save();

        else if((action === 'load') && (name !== undefined) && name.length)
            return this.load(name);

        else if(([ 'delete', 'remove' ].includes(action)) && (name !== undefined) && name.length)
            return this.delete(name);

        else if(action === 'list')
            return this.list();

        // Show current environment
        else
            return this.showHelp();
    }

    /**
     * Show the main help message
     */
    async showHelp() {
        console.log([
            ``,
            `Manage environments for GIT and SSH.`,
            ``,
            `Use:`,
            `  fox-user                 Show current environment info.`,
            `  fox-user help            Show current help info.`,
            `  fox-user clear           Create a empty environment for SSH and GIT.`,
            `  fox-user save            Save current environment to current name setting.`,
            `  fox-user create [name]   Save current environment as specific name.`,
            `  fox-user load [name]     Load environment by specific name.`,
            `  fox-user delete [name]   Delete environment by specific name.`,
            `  fox-user list            List all environment names.`,
            ``,
            `The name allows only alphanumeric characters, arroba, dots and dashes,`,
            `by example: work, personal, test_env, hacking, special-name,`,
            `special.name@gmail.com, my-user.work`,
            ``,
            `Examples:`,
            `  1. User create a empty environment            : fox-user clear`,
            `  2. User save new environment for work use     : fox-user create work`,
            `  3. User create a empty environment            : fox-user clear`,
            `  4. User save new environment for personal use : fox-user create personal`,
            `  5. User load work environment                 : fox-user load work`,
            `  6. User load personal environment             : fox-user load personal`,
            `  7. User save current environemn changes       : fox-user save`,
            ``,
            `Where are the backups kept?`,
            `  ${os.homedir()}/.config/fox-user`,
            ``,
            `What files and directories does it save?`,
            this.plan.map(item => `  - ${item.path}`).join(os.EOL),
            ``,
            `Current environment used:`,
            `  - Name: ${this.settings.currentEnv ? this.settings.currentEnv : ''}`,
            `  - Backup path: ${this.settings.currentEnv ? `${this.local}/${this.settings.currentEnv}` : ''}`,
            ``,
        ].join(os.EOL));
    }

    async clear() {
        
        // Show header progress
        console.log(`Creating a empty environment ...`);

        // Clear all folders / files
        for(let item of this.plan) {

            if((!item.cleanable) || (!fs.existsSync(item.path)))
                continue;

            // Copy
            console.log(`[CLEAN] ${item.path}`);

            // Delete old folder / file
            fs.rmSync(item.path, { recursive: true, force: true });
        }

        // Save current environment in settings
        this.settings.currentEnv = null;

        console.log(`Done!`);
    }

    async save() {

        // Constants
        const local = `${this.local}/${this.settings.currentEnv}`;

        // Check current environment name is set
        if(!this.settings.currentEnv)
            throw new Error(`Current environment is not found. Create or load one first.`);

        // Show header progress
        console.log(`Saving current environment to ${local} ...`);

        // Delete all
        if(fs.existsSync(local))
            fs.rmSync(local, { recursive: true, force: true });

        // Create local store environment again
        fs.mkdirSync(local, { recursive: true });

        // Copy all plan files
        for(let item of this.plan) {

            // File or directory exists?
            if(!fs.existsSync(item.path)) {
                console.log(`[SKIP] ${item.path}`);
                continue;
            }

            // Copy
            console.log(`[COPY] ${item.path}`);
            fs.cpSync(item.path, `${local}/${path.basename(item.path)}`, { recursive: true });
        }

        // Success log
        console.log(`All files and folders are saved for environment: ${this.settings.currentEnv}`);
    }

    async create(name) {

        // Constants
        const local = `${this.local}/${name}`;

        // Name validation
        if(!name.match(/^[\w\-_\.\@]{1,128}$/))
            throw new Error(`Invalid name format.`);

        // Show header progress
        console.log(`Saving current environment to ${local} ...`);
        
        // Check directory is already exist
        if(fs.existsSync(local))
            throw new Error(`Environment name is already exists. Delete it first.`);
        
        // Create local store environment
        fs.mkdirSync(local, { recursive: true });

        // Copy all plan files
        for(let item of this.plan) {

            // File or directory exists?
            if(!fs.existsSync(item.path)) {
                console.log(`[SKIP] ${item.path}`);
                continue;
            }

            // Copy
            console.log(`[COPY] ${item.path}`);
            fs.cpSync(item.path, `${local}/${path.basename(item.path)}`, { recursive: true });
        }

        // Save current environment in settings
        this.settings.currentEnv = name;

        // Success log
        console.log(`All files and folders are saved.`);
    }

    async load(name) {
        
        // Constants
        const local = `${this.local}/${name}`;

        // Name validation
        if(!name.match(/^[\w\-_\.\@]{1,128}$/))
            throw new Error(`Invalid name format.`);

        // Check directory is already exist
        if(!fs.existsSync(local))
            throw new Error(`Environment name is not found.`);

        // Show header progress
        console.log(`Restoring environment from ${local} ...`);

        // Copy all plan files
        for(let item of this.plan) {

            let from = `${local}/${path.basename(item.path)}`;

            // File or directory exists?
            if(!fs.existsSync(from)) {
                console.log(`[SKIP] ${from}`);
                continue;
            }

            // Copy
            console.log(`[COPY] ${from}`);

            // Delete old folder / file
            fs.rmSync(item.path, { recursive: true, force: true });

            // Copy folder / file
            fs.cpSync(from, item.path, { recursive: true });
        }

        // Save current environment in settings
        this.settings.currentEnv = name;

        // Success log
        console.log(`All files and folders are restored.`);
    }

    async list() {

        // Main header log
        console.log([
            ``,
            `Current environments:`,
        ].join(os.EOL));

        // Find all folders from local
        return fsp.readdir(this.local, { withFileTypes: true })

        // Only directories
        .then(items => items.filter(item => item.isDirectory()))

        // Only folder name
        .then(items => items.map(item => item.name))
        .then(items => items.sort(Intl.Collator().compare))

        // List log
        .then(items => items.map(item => `${item} -> ${this.local}/${item}`))
        .then(items => items.forEach(item => console.log(item)))
        .then(() => console.log(``));
    }

    async loadSettings() {

        // Settings file exist?
        if(!fs.existsSync(`${this.local}/settings.json`))
            return;

        // Load settings from local file
        return fsp.readFile(`${this.local}/settings.json`)
        .then(data => (this.settings = JSON.parse(data)));
    }

    async saveSettings() {

        // Save settings to local file
        return fsp.writeFile(`${this.local}/settings.json`,
            JSON.stringify(this.settings, null, 2));
    }

    async delete(name) {
        // Constants
        const local = `${this.local}/${name}`;

        // Name validation
        if(!name.match(/^[\w\-_\.\@]{1,128}$/))
            throw new Error(`Invalid name format.`);

        // Show header progress
        console.log(`Deleting environment: ${local} ...`);

        // Check directory is already exist
        if(!fs.existsSync(local))
            throw new Error(`Environment name is not found.`);

        // Delete all
        fs.rmSync(local, { recursive: true, force: true });

        if(name === this.settings.currentEnv)
            this.settings.currentEnv = null;

        // Success log
        console.log(`All files and folders are deleted.`);
    }
}

new FoxEnv();
