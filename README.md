# GridCal

GridCal is a yearly tracker designed for visibility, minimalism, and usability.
It allows you to keep track of high-level events of the entire year.
It offers functionalities to create monthly topics and categorize events in a per-topic fashion.
For simplicity, each month only allows up-to 4 topics, making you aware of focuses and forcing you to prioritize.
The app offers local persistent storage as well as download/upload calendar functionality.

![screenshot](docs/screenshot.png)

Implementation wise, it is a simplistic web-app built with React and [Next.js](https://nextjs.org).

## How to use

### 🗓 Create Topics and Events

Start by typing in the month header to create a topic—think of it like a lane for your calendar.
Topics could be general themes like work, study, or life—just 4 per month to help you focus on what truly matters.

Then, simply click and drag on the calendar grid to create events.
Type directly inside an event box to name it!

> ✨ Note: Each topic can only have one event per day—this is by design to help you stay focused and intentional.

![1-topic-events](docs/1-topic-events.gif)

When you hover over the calendar grid, you’ll see the weekday labels (like “MON”, “TUE”) to help you stay oriented.
We also highlight “TODAY” so you always know where you are in the year.

### 🎨 Edit, Delete, and Add Color

Right-click on an event to reveal a quick menu.
Click the 🗑 trash button to remove it, or just press backspace/delete after clearing the text to quickly remove it.
Want to add some flair? Use the color pickers to color-code your events—maybe by priority, mood, or category. Your system, your rules!

![2-delete-change-color](docs/2-delete-change-color.gif)

### 📆 Adjust and Rearrange

Each event has small handles on the sides.
Drag them to stretch or shrink the event’s duration.
You can also reorder your monthly topics by dragging the handles next to the topic name. Easy and satisfying.

![3-drag-rearrange](docs/3-drag-rearrange.gif)

### 🧠 Add Notes by Quarter

Each quarter has a little notes section below.
Notes work a lot like events: you can type in them, color them, move them, and resize them.
Some ideas: use emojis, mark big deadlines, or jot down quick thoughts.
Tiny 1x1 notes are great for little visual markers too!

![4-adding-notes](docs/4-adding-notes.gif)

### 💾 Save, Load, and Start Fresh

In the top-right corner, you’ll find buttons to save and erase your calendar.

- Save downloads a .json file with all your entries
- Erase wipes the slate clean
- Upload brings everything back from a saved file—just like magic ✨

![5-save-erase-upload](docs/5-save-erase-upload.gif)

### 📅 Jump Between Years

Click the year (e.g., 2025) in the nav bar to switch to another year.
Saved calendars work across any year—so you can plan ahead (or backtrack) anytime.

![6-change-year](docs/6-change-year.gif)

### 🖨️ Print and Make It Your Own

GridCal is made to be printer friendly—because sometimes, nothing beats pen and paper.
When you print in landscape mode, the year is split into two pages:
Q1 + Q2 on the first, and Q3 + Q4 on the second.

Feel free to jot, doodle, or color in your calendar by hand. Make it personal. Make it yours.

## Developing

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
