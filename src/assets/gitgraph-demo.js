/* INICIO CONFIGURACIONES*/
var myTemplateConfig = {
    colors: [	"#2e5cb8", 
    			"#008000", 
				  "#52527a",
				  "#476b6b",
				  "#808080",
				  "#cc9900"], // branches colors, 1 per column

  branch: {
    lineWidth: 7,
    spacingX: 40,
    showLabel: true,
	labelColor: "white", 
    mergeStyle: "straight",
    labelFont: "bold 15pt Arial",
    labelRotation: 0
  },
  commit: {
    spacingY: -35,
    dot: {
      size: 12
    },
    message: {
	  displayAuthor: true,
	  displayBranch: true,
	  displayHash: false,
	  labelColor  : "black",
	  font: "bold 12pt Arial"
    },
    tooltipHTMLFormatter: function(commit) {
      return "<b>" + commit.sha1 + "</b>" + ": " + commit.message;
    }
  }
};

var myTemplate = new GitGraph.Template(myTemplateConfig);

var config = {
	template: myTemplate,
  //template: "metro",
  mode : "extended"
};

var gitGraph = new GitGraph(config);
/* FIN CONFIGURACIONES */


/*COMMITS*/
var ETIC =gitGraph.branch({name: "ETIC"});

gitGraph.author="AREA";
ETIC.commit({message:"220 ETIC Deriva a GF"});

var GF =gitGraph.branch({parentBranch:ETIC,name:"GF"});
gitGraph.author = "CIUDAD EULOGIO-MARIA TERESA";
GF.commit("14788 ATENDIDO- 12/04/2018 - 10:13:24");
gitGraph.author = "CIUDAD EULOGIO- MARIA TERESA";
GF.commit("14788 ATENDIDO- 16/04/2018 - 04:11:13");
gitGraph.author = "CIUDAD EULOGIO- MARIA TERESA";
GF.commit("14788 ATENDIDO- 16/05/2018 - 09:29:08");
gitGraph.author = "AREA";
GF.commit("226 GF Deriva a EP");


var EP =gitGraph.branch({parentBranch: GF, name: "EP"}); 
gitGraph.author = "CHAVEZ AGUAYO- HUMBERTO WILLY";
EP.commit("10959 ATENDIDO- 12/04/2018 - 12:41:24");
var EGAB =gitGraph.branch("EGAB");
gitGraph.author = "10959 CHAVEZ AGUAYO- HUMBERTO WILLY";
EP.commit("ATENDIDO- 5/05/2018 - 03:39:34");
EP.author = "Area";
EP.commit("239 EP Deriva a EGAB");
var EGAB =gitGraph.branch({parentBranch: EP, name: "EGAB"});
gitGraph.author = "QUISPE TALLA- NELSON ERNESTO";
EGAB.commit("15364 ATENDIDO- 09/02/2018 - 09:54:45");
gitGraph.author = "CARDENAS PAJUELO- LOURDES PAOLA";
EGAB.commit("13878 DERIVADO- 12/02/2018 - 09:43:02");
gitGraph.author = "APCHO MEZA- RICHARD ANTHONY";
EGAB.commit("14619 DERIVADO- 13/02/2018 - 12:43:37");
gitGraph.author = "QUISPE TALLA- NELSON ERNESTO";
EGAB.commit("15364 ATENDIDO- 01/03/2018 - 02:50:23");
gitGraph.author = "CHU ARMIJO- GLORIA ELENA";
EGAB.commit("10975 DERIVADO- 02/03/2018 - 12:52:02");
gitGraph.author = "CARDENAS PAJUELO- LOURDES PAOLA";
EGAB.commit("13878 DERIVADO- 02/03/2018 - 12:52:02");
gitGraph.author = " QUISPE TALLA- NELSON ERNESTO";
EGAB.commit("15364 ATENDIDO- 21/05/2018 - 09:52:39");
gitGraph.author = "MORA CASTILLO- LUIS ALBERTO";
EGAB.commit("15375 DERIVADO- 22/05/2018 - 02:17:11");

EGAB.merge(ETIC); // MERGE


ETIC.author = "Area";
ETIC.commit("240 ETIC Deriva a EPEC");


var EPEC=gitGraph.branch({parentBranch: ETIC, name: "EPEC"}); 
EPEC.author = "Sys";
EPEC.commit("404-No Results Yet- dd/mm/yy - dd/mm/yy");
EPEC.merge(ETIC);

ETIC.author = "AGREDA DIAZ- PABLO JOSEPH";
ETIC.commit("13098 PENDIENTE- 29/11/2017 - 02:53:29");
ETIC.author = "RUIZ HEREÑA- JORGE EDUARDO";
ETIC.commit("10493 ATENDIDO- 29/11/2017 - 02:55:13");
ETIC.author = "FIGUEROA CALATAYUD- LUIS DAMIAN";
ETIC.commit("12867 ATENDIDO- 29/11/2017 - 02:55:55");
ETIC.author = "FARFAN BLACKADDER- FERNANDO EUGENIO";
ETIC.commit("11156 ATENDIDO- 30/11/2017 - 11:02:21");
ETIC.author = "AGREDA DIAZ- PABLO JOSEPH";
ETIC.commit("13098 ATENDIDO- 27/03/2018 - 10:01:57");
ETIC.author = "RUIZ HEREÑA- JORGE EDUARDO";
ETIC.commit("10493 ATENDIDO- 28/03/2018 - 09:09:52");
ETIC.author = "FARFAN BLACKADDER- FERNANDO EUGENIO";
ETIC.commit("11156 DERIVADO- 28/03/2018 - 04:36:37");