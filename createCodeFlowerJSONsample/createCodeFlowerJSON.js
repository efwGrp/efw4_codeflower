var createCodeFlowerJSON={};
createCodeFlowerJSON.paramsFormat={
};
createCodeFlowerJSON.fire=function(params){
	//var src="C:/Users/kejun.chang/Documents/GitHub/efw4.X/src";
	var src="C:/Users/kejun.chang/Documents/GitHub/test";
	//var src="C:/EFW_ALL/apache-tomcat-9.0.24/projects/aibot";
	
	
	function getChildrenFromFolder(folder){
		var lst=absfile.list(folder,true).debug();
		var ret=[];
		for(var i=0;i<lst.length;i++){
			var item=lst[i];
			if(item.mineType=="directory"){
				ret.push({"name":item.name,"children":getChildrenFromFolder(item.absolutePath)});
			}else{
				var size=Math.sqrt(item.length);
				ret.push({"name":item.name,"size":size,"language":item.mineType});
			}
		}
		return ret;
	}
	var json={"name":"root","children":getChildrenFromFolder(src)};
	return (new Result())
		.runat("body")
		.withdata({
			"textarea":JSON.stringify(json)
		});
	
}