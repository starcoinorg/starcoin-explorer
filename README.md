## Version dependency in development

`$node -v`\
v10.12.0

`$npm -v`\
6.4.1

`$tsc -v`\
Version 4.1.3

`$yarn -v`\
1.22.10

`$npx -v`\
6.4.1


`$npx create-react-app  starcoin-explorer  --template typescript`

## Set Environment Variables
```
export REACT_APP_STARCOIN_API_URL=<starcoin-explorer-api-url>
export REACT_APP_STARCOIN_NETWORKS=<available-networks>
```

## How to run

> check for updates first if needed
>
>`$git clone git@github.com:starcoinorg/starcoin-explorer.git`\
>`$cd starcoin-explorer`\
>`$npm install`

`$yarn start`

Runs the app in the development mode.\
Open [http://localhost:3007](http://localhost:3007) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## How to test

`$yarn test`

Launches the test runner in the interactive watch mode.

## How to deploy

`$yarn build`

Builds the app for production to the `build` folder.

Your app is ready to be deployed!

>You may serve it locally with a static server for test before deploying.
>
>  `npm install -g serve`\
>  `serve -s build`
>
>then visit: [http://localhost:5000](http://localhost:5000)

## How to CI/CD

 ```
 $git tag vx.y.z
 $git push --tag
 ```

 A github action will be triggered and deploy the newest version of `build` folder to [this repo](https://github.com/starcoin-explorer/starcoin-explorer.github.io).
