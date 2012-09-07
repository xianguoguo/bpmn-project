(function (window, oCanvas, undefined) {
    var isArray = function (o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };

    function dataBase() {
        var json = {};
        var nodes = {};
        var max = 0;
        var count = 0;

        function JsonMap() {
        }

        JsonMap.prototype = {
            set max(value) {
                if (value > max) {
                    max = ~~value;
                }
            },
            get max() {
                return (++max);
            },
            set json(value) {
                var key, nexts, i;
                json = {};
                nodes = {};
                max = 0;
                count = 0;
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        this.max = key;
                        this.add(value[key], key);
                    }
                }
                for (key in json) {
                    if (json.hasOwnProperty(key)) {
                        nexts = json[key].next;
                        for (i = 0; i < nexts.length; i++) {
                            if (json[nexts[i]].prev.indexOf(key) === -1) {
                                json[nexts[i]].prev.push(key);
                            }
                        }
                    }
                }
            },
            add:function (node, key) {
                var key = key || this.max;
                json[key] = {
                    "x":0,
                    "y":0,
                    "key":key,
                    "text":node.text || "",
                    "rows":0,
                    "cols":0,
                    "export":node.export || null,
                    "type":node.type,
                    "isNode":true,
                    "prev":[],
                    "next":!!node.next ? node.next.split(",") : []
                };
                if (json[key].export !== null) {
                    json[key].export.export = json[key];
                }
                count++;
                return this;
            },
            find:function (key) {
                nodes = {};
                nodes[key] = json[key];
                return this;
            },
            all:function () {
                nodes = json;
                return this;
            },
            children:function () {
                var nexts = {};
                this.each(function () {
                    var i = 0;
                    for (; i < this.next.length; i++) {
                        if (nexts[this.next[i]] === undefined) {
                            nexts[this.next[i]] = json[this.next[i]];
                        }
                    }
                });
                nodes = nexts;
                return this;
            },
            parents:function () {
                var prevs = {};
                this.each(function () {
                    var i = 0;
                    for (; i < this.prev.length; i++) {
                        if (prevs[this.prev[i]] === undefined) {
                            prevs[this.prev[i]] = json[this.prev[i]];
                        }
                    }
                });
                nodes = prevs;
                return this;
            },
            each:function (fn) {
                var i = 0, key;
                for (key in nodes) {
                    fn.call(nodes[key], i);
                    i++;
                }
                return this;
            },
            remove:function () {
                var i;
                this.each(function () {
                    for (i = 0; i < this.prev.length; i++) {
                        json[this.prev[i]].next.splice(json[this.prev[i]].next.indexOf(this["key"]), 1);
                    }
                    for (i = 0; i < this.next.length; i++) {
                        json[this.next[i]].prev.splice(json[this.next[i]].prev.indexOf(this["key"]), 1);
                    }
                    delete json[this["key"]];
                });
                nodes = {};
                return this;
            },
            layout:function (headKey) {
                var maxRowCount = 0,
                    maxColumnCount = 0,
                    table = [],
                    node = null;
                (function (node) {
                    var i = 0,
                        row = 0;
                    for (; i < node.next.length; i++) {
                        row = Math.max(json[node.next[i]].rows, node.rows + 1);

                        //get the max row count.
                        json[node.next[i]].rows = row;
                        maxRowCount = Math.max(maxRowCount, row);

                        arguments.callee(json[node.next[i]]);
                    }
                })(json[headKey]);

                this.all().each(function () {
                    var row = this.rows;
                    if (!table[row] || !isArray(table[row])) {
                        table[row] = [this];
                    } else {
                        table[row].push(this);
                    }
                });

                for (var r = 0; r < table.length; r++) {
                    for (var c = 0; c < table[r].length; c++) {
                        node = table[r][c];
                        node.cols = c;

                        maxColumnCount = Math.max(maxColumnCount, c);
                    }
                }

                //console.log(table);

                //set center.
                ///*
                var width = (maxColumnCount + 1) * 200;

                this.all().each(function () {
                    this.x = (this.cols + 1 ) * width / (table[this.rows].length + 1) - 100;
                    this.y = this.rows * 100 + 23;
                });
                //*/

                //aligin left
                /*
                 var j = 0;
                 while (j < count) {
                 j++;
                 this.children().each(function (i) {
                 this.cols = i;
                 maxColumnCount = Math.max(maxColumnCount, i);
                 });
                 }

                 this.all().each(function () {
                 this.x = this.cols * 150 + 75;
                 this.y = this.rows * 100 + 23;
                 });
                 */

                return this;
            }
        };
        return new JsonMap();
    }

    oCanvas.registerModule("dataBase", dataBase, "init");
})(window, oCanvas, undefined);