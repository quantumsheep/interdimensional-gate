# Interdimensional Gate
Interdimensional Gate is a Unix-like challenge platform.

# How to install dependencies
Launch `npm install` in `server` and `client` directories.

# How to start servers
You need to use `yarn start` in the `client` directory and `node .` or `npm start` or `nodemon` in the `server` directory.
```
interdimensional-gate/client $ yarn start
interdimensional-gate/server $ nodemon
```

# How to contribute
- Fork this repo (button on top)
- Clone on your local machine

```
git clone https://github.com/QuantumSheep/interdimensional-gate.git
cd hacktoberfest
```

- Create a new branch named by your new functionnality

```
git checkout -b branch-name
```

- Add modifications
- Commit and push

```
git add .
git commit -m "commit's description"
git push origin branch-name
```

- Create a new pull request from your forked repository

## Update your fork
To update a fork, you must specify a new remote upstream repository that will be synced with the fork:

```
git remote add upstream https://github.com/QuantumSheep/interdimensional-gate
```

Then, verify the new upstream repository you've specified for your fork.
```
git remote -v
```

Finally, to pull changes from the upstream repository:
```
git pull upstream/master
```