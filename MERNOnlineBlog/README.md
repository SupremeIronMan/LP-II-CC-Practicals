# Minimal MERN Ecommerce App

## Structure

- `server` - Node.js, Express, MongoDB (Mongoose), Blog CRUD API
- `client` - React (Vite), Axios UI for add/list/delete BLOGS

## Initial Setup

clone the repository by
git clone repo_url

# update packages
sudo apt update


DO NOT sudo apt install node as it will install an older version of node incompatible with vite

## IMPORTANT! Install Node Version Manager first (NVM) and use it to install Node Version 22.x.x
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
2. nvm install 22
3. nvm use 22

# TROUBLESHOOTING DEPENDENCY HELL

just try nuking all packages by either 

rm -rf node_modules

OR

rm -rf node_modules package-lock.json

AND THEN

npm install

This usually works for all errors; and doing this is recommended every time you are trying to deploy this repo for the first time even if there may not be dependency errors. First, npm intall using node v 22+ and then nuke using the above commands and reinstall. everything should work fine then.

## AZURE INBOUND RULES
under the instance's networking (firewall) settings, allow the following port configurations to accept traffic from all IP's

{
port: 5173,

protocol: any,

source: any,

destination: any

}

{
port: 5000,

protocol: any,

source: any,

destination: any

}

# 5173: frontend

# 5000: server

you can find this on your azure account.

## Backend setup

1. Go to `server`
2. Install dependencies:
   - `npm install`
3. Create `.env` and paste your credentials

   the .env shall contain two things
   {
   PORT=5000,
 
   MONGO_URI=<connection_string>
   }
   
5. Run server:
   - `node index.js`

Server runs at `http://localhost:5000`

## Frontend setup

# !IMPORTANT PREREQUISITE
right now the frontend might not be able to talk to backend server because frontend API requests use localhost:5000.

use either LOCALHOST or PUBLIC_IP; try localhost first if it fails resort to public IP of the instance

where would you change this configuration?

# check in /client/

edit the vite.config.js file and update the 

TARGET to "http:<public_ip> OR <localhost>:SERVER_PORT(5000)"

and save.

(btw this is already done for u <3)

now your frontend should be configured to talkto your backend server.

1. Go to `client`
2. Install dependencies:
   - `npm install`
3. Run frontend:
   - `npm run dev`

Client runs at `http://localhost:5173`
