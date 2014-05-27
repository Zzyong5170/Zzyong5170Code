/*
	1. 定义游戏入口函数
	2. 在函数中定义关联父容器的对象container
	3. 定义16个目标对象数组
	4. 通过prototype的形式添加对游戏的操作逻辑函数
		1). 初始化游戏 init()
		2). 创建每一个目标函数 createTarget()
		3). 对每一个目标添加必要属性 setTargetAttr()
		4). 创建产生随机目标的函数 generateRandomTarget()
		5). 通过w,s,a,d键控制游戏,判断游戏逻辑 moveTarget()
		6). 合并 merge()
		7). 清理 clean()
		8). 判断相等 equals()
		9). 游戏结束函数 over()
*/

/* start */
function my2048(container) {
	this.container = container;
	this.targets = new Array(16);
}

my2048.prototype = {
	init : function() {
		for(var i = 0, targetsLength = this.targets.length; i < targetsLength; i++) {
				var tar = this.createTarget(0); // 初始化值为0
				this.container.appendChild(tar);
				this.targets[i] = tar;
		}
		this.generateRandomTarget();
		this.generateRandomTarget();
	},
	createTarget : function(val) {
		var tar = document.createElement("div");
		this.setTargetAttr(tar, val);
		return tar;	
	},
	setTargetAttr : function(tar, val) {
		tar.className = "tile tile" + val;
		tar.setAttribute("val", val);
		tar.innerHTML = val > 0 ? val : '';
	},
	generateRandomTarget : function() {
		var emptyTargetPositions = [];
		for(var i = 0, targetsLength = this.targets.length; i < targetsLength; i++) {
			if(this.targets[i].getAttribute("val") <= 0) {
				emptyTargetPositions.push(this.targets[i]);
			}
		}
		var tar = emptyTargetPositions[Math.floor(Math.random() * emptyTargetPositions.length)];
		this.setTargetAttr(tar, Math.random() < 0.8 ? 2 : 4);
	},
	moveTarget : function(keyChar) {
		switch(keyChar) {
			 case "W" :
			 	for(var i = 4, targetsLength = this.targets.length; i < targetsLength; i++) {
			 		var j = i;
			 		while(j >= 4) {
			 			this.merge(this.targets[j - 4], this.targets[j]);
			 			j -= 4;
			 		}			 		
			 	}
			 break;	
			 
			 case "S" :
			 	for(var i = 11; i >= 0; i--) {
			 		var j = i;
			 		while(j <= 11) {
			 			this.merge(this.targets[j + 4], this.targets[j]);
			 			j += 4;
			 		}
			 	}
			 break;
			 
			 case "A" :
			 	for(var i = 1, targetLength = this.targets.length; i < targetLength; i++) {
			 		 var j = i;
			 		while(j % 4 != 0) {
			 			this.merge(this.targets[j - 1], this.targets[j]);
			 			j -= 1;
			 		}
			 	}
			 break;
			 
			 case "D" :
				for(var i = 14; i >= 0; i--) {
					var j = i;
					while(j % 4 != 3) {
						this.merge(this.targets[j + 1], this.targets[j]);
						j += 1;
					}
				}
			 break;
		}
		this.generateRandomTarget();
	},
	merge : function(upTarget, downTarget) {
		if(upTarget.getAttribute("val") <= 0) {
			if(downTarget.getAttribute("val") >= 0) {
				this.setTargetAttr(upTarget, downTarget.getAttribute("val"));
				this.setTargetAttr(downTarget, 0);
			}
		} else {
			if(upTarget.getAttribute("val") === downTarget.getAttribute("val")) {
				this.setTargetAttr(upTarget, parseInt(upTarget.getAttribute("val")) + parseInt(downTarget.getAttribute("val")));
				//this.setTargetAttr(upTarget, eval(upTarget.getAttribute("val") + downTarget.getAttribute("val")));
				this.setTargetAttr(downTarget, 0);				
			}
		}
	},
	clean : function() {
		for(var i = 0; i < this.targets.length; i++) {
			this.container.removeChild(this.targets[i]);
		}
	},
	equals : function(upTarget, downTarget) {
		return upTarget.getAttribute("val") == downTarget.getAttribute("val");
	},
	over : function() {
		for(var i = 0, targetsLength = this.targets.length; i < targetsLength; i++) {
			if(this.targets[i].getAttribute("val") <= 0) {
				return false;
			}
			if(i % 4 != 3) {
				if(this.equals(this.targets[i],this.targets[i + 1])) {
					return false;
				}
			}
			if(i <= 11) {
				if(this.equals(this.targets[i], this.targets[i + 4])) {
					return false;
				}
			}
		}
		return true;
	}	
};
/* end */

var game;
var startButton;

window.onload = function() {
	var div2048 = document.getElementById("div2048");
	startButton = document.getElementById("start");
	startButton.onclick = function() {
		this.style.display = "none";
		game = game || new my2048(div2048);
		game.init();
	};
};

window.onkeydown = function(e) {
	var keyNum;
	var keyChar;
	
	if(e.event) { // IE
		keyNum = e.keyCode; 	
	}
	if(e.which) { // 其他
		keyNum = e.which;
	}
	keyChar = String.fromCharCode(keyNum);
	if(["W", "S", "A", "D"].indexOf(keyChar) > -1) {
		if(game.over()) {
			game.clean();
			startButton.style.display = "block";
			return;			
		}
		game.moveTarget(keyChar);
	}
};