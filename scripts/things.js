/**
 * @file thing.js
 * @author tomasy
 */

$(function () {
    var chrome = window.chrome;
    var bg = chrome.extension.getBackgroundPage();
    var Things = bg.getThingListInstance();
    var colorListByLevel = [
        'gray',
        'white',
        'green',
        'blue',
        'purple',
        'orange'
    ];

    function getLevelByTimes(all, cur) {
        if (!cur) {
            return 0;
        }

        var ratio = all / cur;

        if (ratio >= 4) {
            return 0;
        }
        else if (ratio >= 3) {
            return 1;
        }
        else if (ratio >= 2) {
            return 2;

        }
        else if (ratio >= 1) {
            return 3;

        }
        else if (ratio >= 0.5) {
            return 4;

        }

        return 5;
    }

    var currentThing = null;
    var recycleBin = [];

    var ThingView = Backbone.View.extend({

        tagName: 'li',

        template: _.template($('#item-template').html()),

        events: {
            'click .toggle': 'toggleDone',
            'dblclick .view': 'edit',
            'click a.addtimes': 'addTimes',
            'keypress .title-edit': 'updateOnEnter',
            'keypress .alltimes-edit': 'updateOnEnter',
            'click .edit-done': 'close',
            'dragstart .view': 'dragstart',
            'dragend .view': 'dragend',
            'dragenter .view': 'dragenter',
            'dragover .view': 'dragover',
            'drop .view': 'drop'

        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.editor = this.$('.edit');
            return this;
        },

        toggleDone: function () {
            this.model.toggle();
        },

        edit: function () {
            this.$el.addClass('editing');
            this.editor.find('.title-edit').focus();
        },

        getLevel: function (all, curInc) {
            var curtimes = this.model.get('curtimes') + curInc || 0;
            var alltimes = all || this.model.get('alltimes');

            return getLevelByTimes(alltimes, curtimes);
        },

        addTimes: function () {
            var level = this.getLevel(0, 1);
            this.model.save({
                curtimes: this.model.get('curtimes') + 1,
                level: level,
                color: colorListByLevel[level]

            });
        },

        close: function () {
            var title = this.editor.find('.title-edit').val();
            var alltimes = this.editor.find('.alltimes-edit').val();
            if (!title || !alltimes) {
                this.clear();
            }
            else {
                var level = this.getLevel(alltimes, 0);
                this.model.save({
                    title: title,
                    alltimes: alltimes,
                    level: level,
                    color: colorListByLevel[level]

                });
                this.$el.removeClass('editing');
            }
        },

        updateOnEnter: function (e) {
            if (e.keyCode === 13) {
                this.close();
            }
        },

        dragstart: function (e) {
            e = e.originalEvent;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            currentThing = this;

            return true;
        },

        dragend: function (e) {
            e = e.originalEvent;
            e.dataTransfer.clearData('text/html');
            $('li.draghover').removeClass('draghover');
            App.dustbin.removeClass('hover');

            return false;
        },

        dragenter: function (e) {
            if (currentThing === this) {
                return;
            }
            e = e.originalEvent;
            App.$('li.draghover').removeClass('draghover');
            this.$el.addClass('draghover');
        },

        dragover: function (e) {
            e.originalEvent.preventDefault();
            return true;
        },

        drop: function (e) {
            var from = currentThing.model.get('order');
            var to = this.model.get('order');

            currentThing.model.set('order', to);
            this.model.set('order', from);

            Things.sort();
        },

        clear: function () {
            this.model.destroy();
        }

    });

    var AppView = Backbone.View.extend({

        el: $('#timesapp'),

        statsTemplate: _.template($('#stats-template').html()),

        events: {
            'click #addOne': 'createOnClick',
            'keypress #new-thing': 'createOnEnter',
            'keypress #new-times': 'createOnEnter',
            'dragenter #dustbin': 'dragenter',
            'dragover #dustbin': 'dragover',
            'drop #dustbin': 'drop',
            'click #undel': 'undel',
            'click #closeundel': 'closeundel'
        },

        initialize: function () {
            this.input = this.$('#new-thing');
            this.times = this.$('#new-times');
            this.dustbin = this.$('#dustbin');
            this.undelbar = this.$('#undelbar');

            this.listenTo(Things, 'add', this.addOne);
            this.listenTo(Things, 'reset sort', this.addAll);
            this.listenTo(Things, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            Things.fetch();
        },

        render: function () {
            var done = Things.done().length;
            var remaining = Things.remaining().length;

            if (Things.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({
                    done: done,
                    remaining: remaining

                }));
            }
            else {
                this.main.hide();
                this.footer.hide();
            }
        },

        addOne: function (Thing) {
            var view = new ThingView({
                model: Thing

            });
            this.$('#thing-list').append(view.render().el);
        },

        addAll: function () {
            this.$('#thing-list').empty();
            Things.each(this.addOne, this);
        },

        create: function () {
            if (!this.input.val()) {
                return;
            }

            Things.create({
                title: this.input.val(),
                alltimes: this.times.val() || 1,
                curtimes: 0,
                level: 0,
                color: colorListByLevel[0]

            });
            this.input.val('');
            this.times.val('');
        },

        createOnClick: function (e) {
            this.create();
        },

        createOnEnter: function (e) {
            if (e.keyCode === 13) {
                this.create();
            }
        },

        dragenter: function (e) {
            this.dustbin.addClass('hover');
            this.$('li.draghover').removeClass('draghover');
        },

        dragover: function (e) {
            e.originalEvent.preventDefault();
            return true;
        },

        drop: function () {
            this.dustbin.removeClass('hover');
            if (currentThing) {
                currentThing.model.destroy();
                recycleBin.push(currentThing.model.attributes);
                currentThing = null;
                this.showUndoBar();
            }
        },

        undel: function (e) {
            e.preventDefault();

            var modelAttributes = recycleBin.pop();
            if (modelAttributes) {
                Things.create(modelAttributes);
                this.closeundel();
            }
        },

        closeundel: function (e) {
            e && e.preventDefault();

            clearTimeout(this.undelTimer);
            this.undelbar.fadeOut(200);
        },

        showUndoBar: function () {
            var that = this;

            this.undelbar.fadeIn(200);
            this.undelTimer = setTimeout(function () {
                that.closeundel();
            }, 5000);
        }

    });

    var App = new AppView();
});
