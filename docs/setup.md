# Team Eta #

## PlanIt ##

### Group Members ###
Kyle Silverman: KSilverman

Devon Endicott: dpendic

Artem Aleksanyan: aaleksanyan

## Setup ##

### Compliation ###

We are just converting typescript files into javascript, so we are not using browsify. In our project, we have a tsconfig.json file that we use to determine how the typescript will be compiled and which files to compile onto. To compile ts files into javascript, we are just using `tsc`.

### Heroku ###

Since we have a list of dependencies in our package.json file, heroku will install the dependencies when building the application. In our Procfile, we are running the command as follows:

`web: ts-node main.ts `

We also set up automatic deployment to Heroku, so everytime we push or merge to master, the heroku application will build and deploy.