// js/map_points.js

// --- Model ---
// 1. Create a model class
var MapPointItem = Backbone.Model.extend({});


// --- Model View --- 
// 1. Create a model view class
var MapPointView = Backbone.View.extend({
	template: _.template('<h3 class="<%= status %>">' + 
		'<input type="checkbox" ' +
		'<% if (status === "complete") print("checked")%> />' +
		'<%= title %></h3>'),

	events: {
		'change input': 'toggleStatus'
	},

	initialize: function() {
		// Re-render the view whenever the model changes
		this.model.on('change', this.render, this);
		// Hide item if it's removed from collection
		this.model.on('hide', this.remove, this);
	},

	render: function(){
		// Renders the view template from model data
		// Updates this.el with the new HTML
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// --- Collection ---
// 1. Create a collection class
var MapPointList = Backbone.Collection.extend({
	model: MapPointItem,

	initialize: function(){
		// If item is removed from collection,
		// Hide the model and its attaching view
		this.on('remove', this.hideModel);
	},

	hideModel: function(model){
		// Model view initialize function is called
		model.trigger('hide');
	}
});

// 2. Create a collection instance
var mapPointList = new MapPointList();

// 3. Setup our collection
mapPointList.reset([
	{"id":"0","spot_number":"1","title":"Tornado forms","lat":"-92.894897","long":"42.54524","img":"x","text":"The tornado forms at 4:45 p.m."}
]);

// --- Collection View --- 
// 1. Create a collection view class
var MapPointListView = Backbone.View.extend({
	initialize: function(){
		// This will run when we add another todo item to our collection
		this.collection.on('add', this.addOne, this);
	},

	addOne: function(mapPointItem){
		// Create a model view instance with each item in collection
		var mapPointView = new MapPointView({ model: mapPointItem });
		this.$el.append(mapPointView.render().el);
	},

	render: function(){
		// Run loop through collection and create a new view
		// For each item in our collection
		this.collection.forEach(this.addOne, this);
	}
});

// 2. Create a colllection view instance
// Ties collection to view
var mapPointListView = new MapPointListView({ collection: mapPointList });
mapPointListView.render();

// Append to page
// $('#sidebar_content').append(mapPointListView.el);