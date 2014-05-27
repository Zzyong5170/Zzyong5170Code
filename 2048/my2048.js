/*
	1. ������Ϸ��ں���
	2. �ں����ж�������������Ķ���container
	3. ����16��Ŀ���������
	4. ͨ��prototype����ʽ��Ӷ���Ϸ�Ĳ����߼�����
		1). ��ʼ����Ϸ init()
		2). ����ÿһ��Ŀ�꺯�� createTarget()
		3). ��ÿһ��Ŀ����ӱ�Ҫ���� setTargetAttr()
		4). �����������Ŀ��ĺ��� generateRandomTarget()
		5). ͨ��w,s,a,d��������Ϸ,�ж���Ϸ�߼� moveTarget()
		6). �ϲ� merge()
		7). ���� clean()
		8). �ж���� equals()
		9). ��Ϸ�������� over()
*/

/* start */
function my2048(container) {
	this.container = container;
	this.targets = new Array(16);
}

my2048.prototype = {
	init : function() {
		for(var i = 0, targetsLength = this.targets.length; i < targetsLength; i++) {
				var tar = this.createTarget(0); // ��ʼ��ֵΪ0
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
	if(e.which) { // ����
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