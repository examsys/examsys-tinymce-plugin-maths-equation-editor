# mathsEquationEditor TinyMCE Plugin

This is a repo containing the mathsEquationEditor TinyMCE plugin.

Developed at the University of Nottingham

Contributors:

* Dr Joseph Baxter
* Adam Clarke

## Getting started

[Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Install yarn globally ```npm install --global yarn```

Install the dependencies by running ```npm install```

## Build instructions

The tools directory contains files that should be used to combine and minimise certain parts of the plugin:

* combine_images.php - Creates the image map used to make the plugins UI
* make_js.php - Combines the JavaScrip in mee/mee/js into a single file
* make_styles.php - Combines the plugins styles into a single minimised file
* makeimages.php - Used to create images that can be used in the UI

You will likely need to run one or more of these files after you make a change to the plugin before
running the build process to get your changes to show.

### Deploy instructions

Run ```yarn build``` to creat dist directory

Copy dist/maths-equation-editor to the desired location

See [documentation about loading external plugins](https://www.tiny.cloud/docs/configure/integration-and-setup/#external_plugins)

## Functionality

Adds a maths equation editor button to the toolbar

![equation toolbar button](./images/insert.PNG)

This launches a dialog where you enter math formula

![equation dialog](./images/open.PNG)

Which is insert into the editor contents

![equation insert](./images/content.PNG)
