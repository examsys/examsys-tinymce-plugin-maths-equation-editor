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

### Deploy instructions

Run ```yarn build``` to creat dist directory

Copy dist/maths-equation-editor to the desired location

See [documentation about loading external plugins](https://www.tiny.cloud/docs/configure/integration-and-setup/#external_plugins)

## Functionality

Adds a maths equation editor button to the toolbar

![equation toolbar button](./images/insert.PNG)

This launches a dialog where you enter math forumula

![equation dialog](./images/open.PNG)

Which is insert into the edtir contents

![equation insert](./images/content.PNG)

