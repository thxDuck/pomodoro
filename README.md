# PomodoroApp

A focused time-management app built with Angular, inspired by the Pomodoro Technique.  
This is a learning project designed to reinforce concepts in Angular development, mobile-first design, and dark theme UI.

---

## 🔧 Features & User Stories

### 1. 🎯 Configure Pomodoro

- **Given**: I'm on the configuration page  
- **Then**: I can adjust Pomodoro settings:
  - Work time duration
  - Break durations (short and long)
  - Number of sessions before a long break
  - Enable/disable auto-start for breaks

### 2. ▶️ Start Pomodoro

- **Given**: I'm on the Home page  
- **When**: I click the **Play** button  
- **Then**: The timer starts counting down  
- **And**: The Pomodoro enters "Work" mode

### 3. 📝 Enter a Task

- **Given**: I'm on the Home page  
- **When**: I type a task like *"Create Feature Repository"*  
- **And**: I click the **Play** button  
- **Then**: The task input becomes disabled (locked)

### 4. ⏸ Pause & Resume

- **Given**: I'm in "Work" or "Break" mode  
- **When**: I click **Pause**  
- **Then**: The timer stops  
- **When**: I click **Resume**  
- **Then**: The timer resumes

### 5. ⏭ Skip Break

- **Given**: I'm in a break session  
- **When**: I click the **Skip** button  
- **Then**: The timer jumps to the next session (usually back to "Work")

---

## 📱 Design Constraints

- **Mobile-First Design**  
  Target resolution: `375x812` (iPhone 12 Mini)

- **Dark Theme**  
  Entire app uses a dark UI palette

- **Framework**  
  Built using the **Angular** framework

- **Design**  
  inspired by [Pomodoro App on Dribbble](https://dribbble.com/shots/15385822-Pomodoro-App)

## Documentation

### Libraries

- [temporal-polyfill](https://www.npmjs.com/package/temporal-polyfill): polyfill for the js Tomporal API (actualy in stage 3 of TC39 proposal). I use this polyfill library beacause it's the lightest lib I've found, it will be removed once the API has been implemented in all browsers.

---

## 🚧 Status

Currently in development as a learning project.

## In progress

Initial setup (setup angular and hello world ok the Home page)
