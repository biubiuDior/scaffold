const getSuitHeight = (node) => {
  var height=SuitHeight(node)-2;//设置合适高度的时候减去两个边框的高度，可以保证紧密镶嵌式不会因为上下边框产生滚动条
  return height;
}

function SuitHeight(node){
  var parentObj=node.parentNode;
  //获得parentObj所有直接非grid子节点
  var childrenObj=parentObj.childNodes;
  var elseChildrenHeight=0;
  for(var i=0;i<childrenObj.length;i++){
      if(childrenObj[i].nodeName === "#text" && !/\s/.test(childrenObj.nodeValue)){
          continue;
      }
      if(childrenObj[i]!==node && childrenObj[i].tagName!=="SCRIPT"&& childrenObj[i].tagName!=="STYLE"
          && childrenObj[i].style.display!=="none" && childrenObj[i].style.position!=="absolute"
          ){//吧script的高度也排除掉
          let marginTop=getDomStyle(childrenObj[i],"marginTop")?parseInt(getDomStyle(childrenObj[i],"marginTop"),10):0;
          let marginBottom=getDomStyle(childrenObj[i],"marginBottom")?parseInt(getDomStyle(childrenObj[i],"marginBottom"),10):0;
          if(childrenObj[i].offsetHeight && childrenObj[i].offsetHeight>0){
              //获得所有非本元素的其他父类子元素的margin的值
              elseChildrenHeight+=childrenObj[i].offsetHeight+marginTop+marginBottom;
          }
      }
  }
  //父级对象的高度-其他对象的高度
  let parentObjPaddingTop = getDomStyle(parentObj,"paddingTop")?parseInt(getDomStyle(parentObj,"paddingTop"),10):0;
  let parentObjPaddingBottom = getDomStyle(parentObj,"paddingBottom")?parseInt(getDomStyle(parentObj,"paddingBottom"),10):0;
  var gridSuitHeight=parentObj.clientHeight-elseChildrenHeight-parentObjPaddingTop-parentObjPaddingBottom;
  return gridSuitHeight;
}

function getDomStyle(curEle,attr){
    if("getComputedStyle" in window){
        return window.getComputedStyle(curEle,null)[attr];
    }else{
        if(attr === "opacity"){
            let val = curEle.currentStyle["filter"];
            let reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
            return reg.test(val)?reg.exec(val)[1]/100:1;
        }else{
            return curEle.currentStyle[attr];
        }
    }
}


export default getSuitHeight;
