angular-meteor-seed
===================

Seed app for AngularJS and meteor.
Based on angular - meteor - example by tom-muhm but trying to create a better folder structure.

Working copy:  http://angular-meteor-seed.meteor.com/

### Setup

clone the repositry

    git clone git@github.com:Urigo/angular-meteor-seed.git
    
2) start the application - so meteroite can download the plugins:

    mrt

### Run

1) Start your app with: 

    mrt

2) open the browser console and add new items with:

    angular.element('[ng-controller=TodosCtrl]').scope().Todos.insert({name: 'Task x'})

3) see the magic happen
