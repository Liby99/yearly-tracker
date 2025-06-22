# GridCal

GridCal is a yearly tracker designed for visibility, minimalism, and usability.
It allows you to keep track of high-level events of the entire year.
It offers functionalities to create monthly topics and categorize events in a per-topic fashion.
For simplicity, each month only allows up-to 4 topics, making you aware of focuses and forcing you to prioritize.
The app offers local persistent storage as well as download/upload calendar functionality.

![screenshot](docs/screenshot.png)

Implementation wise, it is a simplistic web-app built with React and [Next.js](https://nextjs.org).

## How to use

Type in the month-header region to create a topic within a month.
Drag in the Calendar grid to create new events; type inside each event to give them some names.

![1-topic-events](docs/1-topic-events.gif)

Right click on an event will reveal a small menu above the event.
Click on the `trash` button to remove the event.
Click on the color-pickers to give the event some color!
As a shortcut, you can also press `backspace` or `delete` key after the text being emptied to remove an event.

![2-delete-change-color](docs/2-delete-change-color.gif)

There are handles on the two sides of each event.
Drag-and-drop to adjust the start- and end-date of each event.
You can also rearrange the monthly topics by drag-and-dropping the handles on the right hand side of each topic name!

![3-drag-rearrange](docs/3-drag-rearrange.gif)

For each quarter, there is a small space for you to add notes.
Notes are organized in a grid manner.
You can add text within each piece of note, you can also change the color, move, or resize each note, just as you can with the calendar events.
Be creative with the notes and have some fun!

![4-adding-notes](docs/4-adding-notes.gif)

There are buttons on the top-right of our GridCal yearlly tracker.
Press `save` and a `.json` file containing your entire calendar will be downloaded to your computer.
Press `erase` to erase everything within the year view.
As shown in the gif, we `upload` the same json file we just downloaded, and all our calendar entries are now back!

![5-save-erase-upload](docs/5-save-erase-upload.gif)

You can navigate through different years by clicking on the year (e.g., `2025`) in the nav bar and select another year.

![6-change-year](docs/6-change-year.gif)

## Developing

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
