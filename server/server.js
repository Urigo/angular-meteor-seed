
Todos = new Meteor.Collection('todos');

Meteor.startup(function () {
    if (Todos.find().count() === 0) {
        Todos.insert({name: 'Task 1', done:true})
        Todos.insert({name: 'Task 2', done:false})
        Todos.insert({name: 'Task 3', done:false})
    }
});

Parties = new Meteor.Collection('parties');

Meteor.startup(function () {
    if (Parties.find().count() === 0) {
        Parties.insert({name: 'Party 1'})
        Parties.insert({name: 'Party 2'})
        Parties.insert({name: 'Party 3'})
    }
});
