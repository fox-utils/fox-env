# Fox Environment Switcher

Una herramienta que ayuda al desarrollador a cambiar entre perfiles de
despliegue.

## Soporte

Las tecnologías soportadas son:

- SSH
- GIT

## Ejemplo de uso

Instalación:

```
npm install fox-env
```

Uso:

```
$ fox-env
Fox Environment Switcher v1.0.0-stable

Manage environments for GIT and SSH.

Use:
  fox-env                 Show current environment info.
  fox-env help            Show current help info.
  fox-env clear           Create a empty environment for SSH and GIT.
  fox-env save            Save current environment to current name setting.
  fox-env create [name]   Save current environment as specific name.
  fox-env load [name]     Load environment by specific name.
  fox-env delete [name]   Delete environment by specific name.
  fox-env list            List all environment names.

The name allows only alphanumeric characters, arroba, dots and dashes,
by example: work, personal, test_env, hacking, special-name,
special.name@gmail.com, my-user.work

Examples:
  1. User create a empty environment            : fox-env clear
  2. User save new environment for work use     : fox-env create work
  3. User create a empty environment            : fox-env clear
  4. User save new environment for personal use : fox-env create personal
  5. User load work environment                 : fox-env load work
  6. User load personal environment             : fox-env load personal
  7. User save current environemn changes       : fox-env save

Where are the backups kept?
  /home/user/.config/fox-env

What files and directories does it save?
  - /home/user/.ssh
  - /home/user/.bash_history
  - /home/user/.profile
  - /home/user/.bashrc
  - /home/user/.bash_logout
  - /home/user/.bash_profile
  - /home/user/.gitconfig

Current environment used:
  - Name: personal
  - Backup path: /home/user/.config/fox-env/personal
```