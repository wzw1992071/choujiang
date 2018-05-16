
let wheelData = {
	rewardNames:[
		"10元现金","100元代金券",
		"30元现金","200元代金券",
		"50元现金","谢谢惠顾"
	],				//转盘奖品名称数组
    colors:[
    	"#FFF4D7","#FFFFFF",
    	"#FFF4D7","#FFFFFF",
        "#F0F4D8","#FFFFFF",
    ],					//转盘奖品区块对应背景颜色
    
    outsideRadius:180,			//转盘外圆的半径
    textRadius:135,				//转盘奖品位置距离圆心的距离
    insideRadius:68,			//转盘内圆的半径
    startAngle:0,				//开始角度
    
    isRun:false
}

// 计算每块占的角度，弧度制
let baseAngle = Math.PI * 2 / (wheelData.rewardNames.length);

// 获取图片信息
var imgQb = new Image();
imgQb.src = "./img/qb.png";
var imgSorry = new Image();
imgSorry.src = "./img/2.png";

//画图
window.onload=function(){
	drawImg()
	$(".pointer").on("click",function(){
		if(wheelData.isRun) return false;
		wheelData.isRun = !wheelData.isRun;
		//	设值中奖的中奖号
		var item  = 5;
		rotateFunc(item)
	})
}

function rotateFunc(item){
	console.log(baseAngle/Math.PI*180)
	 // 旋转角度 == 270°（当前第一个角度和指针位置的偏移量） - 奖品的位置 * 每块所占的角度 - 每块所占的角度的一半(指针指向区域的中间)
      angles = 360 * 3 / 4 - ( item * baseAngle) - baseAngle / 2; // 因为第一个奖品是从0°开始的，即水平向右方向
	$('#wheelCanvas').rotate({
        angle:0,
        animateTo:270 - baseAngle/Math.PI*180*(item+0.5) + 360*5, // 这里多旋转了5圈，圈数越多，转的越快
        duration:8000,
        callback:function (){ // 回调方法
            $("#rewardTip").html(wheelData.rewardNames[item])
            wheelData.isRun = !wheelData.isRun;

        }
    });
	
}

//画图形以及里面的字
function drawImg(){
	let canvas = document.getElementById("wheelCanvas");
	let ctx=canvas.getContext("2d");
	
//	如果奖品名字太长,分行的行距
    let line_height = 25;
    let canvasW = canvas.width; // 画板的高度
    let canvasH = canvas.height; // 画板的宽度
    //在给定矩形内清空一个矩形
    ctx.clearRect(0,0,canvasW,canvasH);

    //strokeStyle 选定画笔颜色
    ctx.strokeStyle = "#FFBE04"; // 红色
    //font 画布上文本内容的当前字体属性
    ctx.font = '16px Microsoft YaHei';
   	for(let i = 0;i<wheelData.rewardNames.length;i++){
   		// 当前的角度
        let angle = wheelData.startAngle + i * baseAngle;
        // 填充颜色
        ctx.fillStyle = wheelData.colors[i];
        ctx.beginPath();
        /*
         * 画圆弧，和IOS的Quartz2D类似
//       * context.arc(x,y,r,sAngle,eAngle,counterclockwise);
         * x :圆的中心点x
         * y :圆的中心点x
         * sAngle,eAngle :起始角度、结束角度
         * counterclockwise : 绘制方向,可选，False = 顺时针，true = 逆时针
         * */

        ctx.arc(canvasW * 0.5, canvasH * 0.5, wheelData.outsideRadius, angle, angle + baseAngle, false);
        ctx.arc(canvasW * 0.5, canvasH * 0.5, wheelData.insideRadius, angle + baseAngle, angle, true);
        ctx.stroke();
        ctx.fill();
        //保存画布的状态，和图形上下文栈类似，后面可以Restore还原状态（坐标还原为当前的0，0），
        ctx.save();
        
//      重新选取颜色
        ctx.fillStyle = "#E5302F";
        let rewardName = wheelData.rewardNames[i];
        
        let translateX =  canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * wheelData.textRadius;
        let translateY =  canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * wheelData.textRadius;
        ctx.translate(translateX,translateY);
        
//      将画布旋转一定角度然后开始填充字
        ctx.rotate(angle + baseAngle / 2 + Math.PI / 2);
//		根据奖品名称决定要不要分行
        if(wheelData.rewardNames[i].length>8){
        	let newName = wheelData.rewardNames[i].substring(0,8)+","+wheelData.rewardNames[i].substring(8);
        	let nameArr = newName.split(',');
        	for(let j = 0;j<nameArr.length;j++){
        		ctx.fillText(nameArr[j],-ctx.measureText(nameArr[j]).width / 2,j * line_height)
        	}
        	
        }else{
        	ctx.fillText(rewardName,-ctx.measureText(wheelData.rewardNames[i]).width / 2,0)
        }
        if(rewardName == "谢谢惠顾"){
        	imgSorry.onload=function(){
                ctx.drawImage(imgSorry,-15,5);
            };
        	ctx.drawImage(imgSorry,-15,5);
        }

        ctx.restore();
   	}
}

