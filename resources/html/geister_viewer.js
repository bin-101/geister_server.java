// Generated by CoffeeScript 1.10.0
(function() {
  var CellState, GameOfGeister, GeisterObj;

  GeisterObj = (function() {
    GeisterObj.COLOR_NONE = 0;

    GeisterObj.COLOR_RED = 1;

    GeisterObj.COLOR_BLUE = 2;

    GeisterObj.PLAYER_NONE = 0;

    GeisterObj.PLAYER_A = 1;

    GeisterObj.PLAYER_B = 2;

    GeisterObj.prototype.color = null;

    GeisterObj.prototype.player = null;

    GeisterObj.prototype.hidden = false;

    GeisterObj.prototype.moving = false;

    function GeisterObj(color, player) {
      this.color = color;
      this.player = player;
    }

    return GeisterObj;

  })();

  CellState = (function() {
    CellState.prototype.obj = null;

    function CellState(row1, column1) {
      this.row = row1;
      this.column = column1;
      this.obj = new GeisterObj(GeisterObj.COLOR_NONE, GeisterObj.PLAYER_NONE);
    }

    return CellState;

  })();

  GameOfGeister = (function() {
    GameOfGeister.prototype.cellSize = 60;

    GameOfGeister.prototype.numberOfRows = 8;

    GameOfGeister.prototype.numberOfColumns = 8;

    GameOfGeister.prototype.canvas = null;

    GameOfGeister.prototype.drawingContext = null;

    GameOfGeister.prototype.currentCell = null;

    GameOfGeister.prototype.arrow_img = null;

    GameOfGeister.prototype.geister_obj_img = null;

    GameOfGeister.prototype.geister_red_img = null;

    GameOfGeister.prototype.geister_blue_img = null;

    GameOfGeister.prototype.selectedX = null;

    GameOfGeister.prototype.selectedY = null;

    GameOfGeister.prototype.selectedItem = null;

    GameOfGeister.prototype.turn = 'B';

    GameOfGeister.prototype.game_status = 'PREPARE';

    GameOfGeister.prototype.playerA = null;

    GameOfGeister.prototype.playerB = null;

    function GameOfGeister() {
      this.ws = new WebSocket('ws://localhost:8080/ws/geister');
      this.createCanvas();
      this.resizeCanvas();
      this.createDrawingContext();
      this.ready_resources();
      this.ws.geister = this;
      this.ws.onmessage = function(e) {
        return this.geister.update_info(e);
      };
    }

    GameOfGeister.prototype.str2color = function(s) {
      s = s.toUpperCase();
      if (s === 'R') {
        return GeisterObj.COLOR_RED;
      }
      if (s === 'B') {
        return GeisterObj.COLOR_BLUE;
      }
      return GeisterObj.COLOR_NONE;
    };

    GameOfGeister.prototype.update_info = function(e) {
      var c, column, i, item, j, k, l, msg, ref, ref1, row, x, y;
      msg = e.data;
      $('#message').text(msg);
      this.currentCell = [];
      for (row = j = 0, ref = this.numberOfRows; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
        this.currentCell[row] = [];
        for (column = k = 0, ref1 = this.numberOfColumns; 0 <= ref1 ? k < ref1 : k > ref1; column = 0 <= ref1 ? ++k : --k) {
          this.currentCell[row][column] = new CellState(row, column);
        }
      }
      for (i = l = 0; l < 16; i = ++l) {
        item = msg.slice(3 * i, +(3 * i + 2) + 1 || 9e9);
        x = parseInt(item[0]);
        y = parseInt(item[1]);
        c = item[2];
        if (x < 6 && y < 6) {
          if (i < 8) {
            this.currentCell[y + 1][x + 1].obj.player = GeisterObj.PLAYER_B;
          } else {
            this.currentCell[y + 1][x + 1].obj.player = GeisterObj.PLAYER_A;
          }
          this.currentCell[y + 1][x + 1].obj.color = this.str2color(c);
        }
      }
      return this.drawBoard();
    };

    GameOfGeister.prototype.ready_resources = function(f) {
      this.arrow_img = new Image();
      this.arrow_img.src = "arrow.png?" + new Date().getTime();
      return this.arrow_img.onload = (function(_this) {
        return function() {
          _this.geister_obj_img = new Image();
          _this.geister_obj_img.src = "geister_obj.png?" + new Date().getTime();
          return _this.geister_obj_img.onload = function() {
            _this.geister_red_img = new Image();
            _this.geister_red_img.src = "geister_red.png?" + new Date().getTime();
            return _this.geister_red_img.onload = function() {
              _this.geister_blue_img = new Image();
              _this.geister_blue_img.src = "geister_blue.png?" + new Date().getTime();
              return _this.geister_blue_img.onload = function() {
                return _this.initGame();
              };
            };
          };
        };
      })(this);
    };

    GameOfGeister.prototype.initGame = function() {
      this.initCells();
      return this.drawBoard();
    };

    GameOfGeister.prototype.readyGame = function() {
      var column, j, k, ref, ref1, row, start;
      for (row = j = 0, ref = this.numberOfRows; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
        for (column = k = 0, ref1 = this.numberOfColumns; 0 <= ref1 ? k < ref1 : k > ref1; column = 0 <= ref1 ? ++k : --k) {
          if (this.currentCell[row][column].obj.player === GeisterObj.PLAYER_A) {
            this.currentCell[row][column].obj.hidden = true;
          }
        }
      }
      this.drawBoard();
      this.swapOwnObj(100);
      this.game_status = 'RUN';
      return start = $('#start')[0].disabled = true;
    };

    GameOfGeister.prototype.createCanvas = function() {
      return this.canvas = $('#gameboard')[0];
    };

    GameOfGeister.prototype.resizeCanvas = function() {
      this.canvas.height = this.cellSize * this.numberOfRows;
      return this.canvas.width = this.cellSize * this.numberOfColumns;
    };

    GameOfGeister.prototype.createDrawingContext = function() {
      return this.drawingContext = this.canvas.getContext('2d');
    };

    GameOfGeister.prototype.initCells = function() {
      var column, j, ref, results, row;
      this.currentCell = [];
      results = [];
      for (row = j = 0, ref = this.numberOfRows; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
        this.currentCell[row] = [];
        results.push((function() {
          var k, ref1, results1;
          results1 = [];
          for (column = k = 0, ref1 = this.numberOfColumns; 0 <= ref1 ? k < ref1 : k > ref1; column = 0 <= ref1 ? ++k : --k) {
            results1.push(this.currentCell[row][column] = new CellState(row, column));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    GameOfGeister.prototype.drawImage = function(img, x, y, rot) {
      if (rot) {
        this.drawingContext.save();
        this.drawingContext.rotate(180 * Math.PI / 180);
        x = (-x - 1) * this.cellSize;
        y = (-y - 1) * this.cellSize;
      } else {
        x = x * this.cellSize;
        y = y * this.cellSize;
      }
      this.drawingContext.drawImage(img, x, y, this.cellSize, this.cellSize);
      if (rot) {
        return this.drawingContext.restore();
      }
    };

    GameOfGeister.prototype.drawBoard = function() {
      this.drawingContext.clearRect(0, 0, this.drawingContext.canvas.clientWidth, this.drawingContext.canvas.clientHeight);
      this.drawImage(this.arrow_img, 1, 1, false);
      this.drawImage(this.arrow_img, 6, 1, true);
      this.drawImage(this.arrow_img, 1, 6, false);
      this.drawImage(this.arrow_img, 6, 6, true);
      return this.drawGrid();
    };

    GameOfGeister.prototype.drawGrid = function() {
      var column, j, ref, results, row;
      results = [];
      for (row = j = 0, ref = this.numberOfRows; 0 <= ref ? j < ref : j > ref; row = 0 <= ref ? ++j : --j) {
        results.push((function() {
          var k, ref1, results1;
          results1 = [];
          for (column = k = 0, ref1 = this.numberOfColumns; 0 <= ref1 ? k < ref1 : k > ref1; column = 0 <= ref1 ? ++k : --k) {
            results1.push(this.drawCell(this.currentCell[row][column]));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    GameOfGeister.prototype.getObjImage = function(obj) {
      if ($('#hidden').is(':checked') === true) {
        return this.geister_obj_img;
      }
      if (obj.color === GeisterObj.COLOR_BLUE) {
        return this.geister_blue_img;
      }
      if (obj.color === GeisterObj.COLOR_RED) {
        return this.geister_red_img;
      }
      return this.geister_obj_img;
    };

    GameOfGeister.prototype.drawCell = function(cell) {
      var img, ref, ref1, strk, x, y;
      x = cell.column * this.cellSize;
      y = cell.row * this.cellSize;
      if (cell.obj.player !== GeisterObj.PLAYER_NONE && cell.obj.moving === false) {
        img = this.getObjImage(cell.obj);
        this.drawImage(img, cell.column, cell.row, cell.obj.player === GeisterObj.PLAYER_A);
      }
      if ((0 < (ref = cell.column) && ref < 7) && (0 < (ref1 = cell.row) && ref1 < 7)) {
        strk = 'rgba(0, 0, 0, 1)';
      } else {
        strk = 'rgba(0, 0, 0, 0)';
      }
      this.drawingContext.strokeStyle = strk;
      return this.drawingContext.strokeRect(x, y, this.cellSize, this.cellSize);
    };

    return GameOfGeister;

  })();

  console.log("start");

  window.GameOfGeister = GameOfGeister;

}).call(this);
