- avoid if possible
- rebasing and merging are two different things of integrating changes from different brances.
- also used for clean git history
- In merge lets say you create a new "new_feature" branch. lets say someone else merged their code to main before you. so you want that updated `main` branch in your codebase because you do not want to diverge from the master branch for a super long time without getting those new changes. as you make more works, let's say someone else or even more than 5 different engineers merged their code. then you need to get those commits onto your "new_feature" branch. and then you merge again. Imagine you had a feture that would take a week but other engineers had small tasks so they keep merging their code. you might end up having dozens of merge commits that does not add anything you your code. finally when you finish your task and merged your work onto the "main", you will have bunch of non-informative merge commits as part of the history. this is what `rebase` solves.

If we rebased insetead of merging, we rewrite the history, we are creating new commits based upon the original "new_feature" branch commits. as the name says we are setting up a new base for our "net_feature" branch. you will not have "merge commits" anymore. what ever branch you are working will contain all of the commits from master and from feature. With "rebase" we get a much cleaner project. this makes it easier for someone to review your commits. In open source projects, there are thousands of contributors and maybe millions of work all the time, using rebase will make it easier to read the history of features.

Because `rebase` rewrite the commits, you do not want to rebase commits that other people already have. Imagine you pushed up some branch to Github and your coworkers have that work in their machine, so all the commits, if all of a sudden you rebase those commits, you will end up having some commits that they do not have or you they will have some commits that you do not have.

you should rebase your commits that you have on your machine and other people do not have.