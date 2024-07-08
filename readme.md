# Fox Environment Switcher

A tool that helps the developer switch between deployment profiles.

## Support

The supported technologies are:

- SSH
- GIT

## Usage Example

Installation:

```
npm install fox-env
```

Use:

```
$ fox-env
Fox Environment Switcher v1.0.0-stable

Manage environments for GIT and SSH.

Use:
  fox-user                 Show current environment info.
  fox-user help            Show current help info.
  fox-user clear           Create a empty environment for SSH and GIT.
  fox-user save            Save current environment to current name setting.
  fox-user create [name]   Save current environment as specific name.
  fox-user load [name]     Load environment by specific name.
  fox-user delete [name]   Delete environment by specific name.
  fox-user list            List all environment names.

The name allows only alphanumeric characters, arroba, dots and dashes,
by example: work, personal, test_env, hacking, special-name,
special.name@gmail.com, my-user.work

Examples:
  1. User create a empty environment            : fox-user clear
  2. User save new environment for work use     : fox-user create work
  3. User create a empty environment            : fox-user clear
  4. User save new environment for personal use : fox-user create personal
  5. User load work environment                 : fox-user load work
  6. User load personal environment             : fox-user load personal
  7. User save current environemn changes       : fox-user save

Where are the backups kept?
  /home/yhojann/.config/fox-user

What files and directories does it save?
  - /home/yhojann/.ssh
  - /home/yhojann/.bash_history
  - /home/yhojann/.profile
  - /home/yhojann/.bashrc
  - /home/yhojann/.bash_logout
  - /home/yhojann/.bash_profile
  - /home/yhojann/.gitconfig

Current environment used:
  - Name: personal
  - Backup path: /home/yhojann/.config/fox-env/personal
```