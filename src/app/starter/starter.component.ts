import { Component, OnInit, Renderer, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare var $: any;
declare var jsPDF: any;
declare var html2pdf: any;
declare var swal:any;
@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit, OnDestroy {
  // private apiBaseUrl = "http://localhost:4000/";
  private hdnRootURL = "http://localhost:4200/";

  model = {
    uploadedImage: '',
    isImageFileUpload: false,
    imageid:''
  };
  constructor(elementRef: ElementRef, renderer: Renderer, private router: Router, private http: Http) {
    // Listen to click events in the component
    renderer.listen(elementRef.nativeElement, 'click', (event) => {
      // Do something with 'event'
      if (event.toElement != undefined && event.toElement != null && event.toElement != "") {
        var controlId = event.toElement.id;
        if (controlId.indexOf("lbl_") != -1 || controlId.indexOf("heading") != -1) {
          this.EditLabel(event.toElement);
        }
        if (controlId.indexOf("img") != -1) {
          this.EditImage(event.toElement);
        }
        if (controlId.indexOf("lblTable_") != -1) {
          this.EditLabel_Table(event.toElement);
        }
      }
    })

    renderer.listen(elementRef.nativeElement, 'focusout', (event) => {
      var controlId = event.target.id;
      if (controlId.indexOf("txt_") != -1) {
        this.UpdateLabelText(event.target);
      }
      if (controlId.indexOf("txtTable_") != -1) {
        this.UpdateLabelText_Table(event.target);
      }
    })

    renderer.listen(elementRef.nativeElement, 'keypress', (event) => {
      var controlId = event.target.id;
      if (controlId.indexOf("txtTable_") != -1) {
        if(event.keyCode==13){
        this.UpdateLabelText_Table(event.target);
        }
      }      
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  selectedItem = null;
  selectedDivItem = null;
  selectedItemId = null;
  selectedLabel=null;
  color = null;
  controlsCount = 1;
  lstTableData = [];
  objTableData: {};

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  setresize(id)
  {
    if(id.indexOf('divLabel_')!=-1)
    {    
     $("#" + id).resizable(       
      {
          minHeight: 44,       
          minWidth: 154,      
      }); 
    }  
    else if(id.indexOf('img_')!=-1)  
    {
      $("#" + id).resizable(     
      {
         minHeight: 16,
         minWidth: 16,     
      }); 
    }   
    else
    $("#" + id).resizable();   
  }

  drop(ev) {
    var dragx=ev.pageX;
    var dragy=ev.pageY;

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    this.controlsCount = this.controlsCount + 1;
    var elementId = null;
    switch (data) {
      case "Label":
        //Creates Label and returns the div...
        var divLabel = this.createLabel(this.controlsCount, null);
        ev.target.appendChild(divLabel);
        elementId = (this.controlsCount != null) ? "divLabel_" + this.controlsCount : "divLabel";
        this.model.isImageFileUpload=false;
        
        var divID=elementId;
        var label=$('#'+divID+' label').attr('id');
        this.selectedItem=label;
        this.selectedDivItem=divID;
       this.setresize(elementId);
        break;
      case "Heading":
        //Creates Heading Label and returns the div...
        var divLabel = this.createHeading(this.controlsCount, null);
        ev.target.appendChild(divLabel);
        elementId = (this.controlsCount != null) ? "divLabel_" + this.controlsCount : "divLabel";
        break;
      case "Image":
        //Creates image and returns the div...
        var divImage = this.createImage(this.controlsCount, null, "Upload Image....", null, null);

        // appends image into div
        ev.target.appendChild(divImage);
        var selectedImg = $("#" + divImage.id).children("img").attr("id");

        var width = $('#' + selectedImg).width();
        var height = $('#' + selectedImg).height();
        $('#' + divImage.id).width(width + 4);
        $('#' + divImage.id).height(height + 4);
        //elementId = (this.controlsCount != null) ? "img_" + this.controlsCount : "imgDynamic";
        elementId = (this.controlsCount != null) ? "divImage_" + this.controlsCount : "divImage";
        this.model.isImageFileUpload=true;

        var divImageID=elementId;
        var img=$('#'+divImageID+' img').attr('id');
        this.selectedItem=img;
        this.selectedDivItem=divImageID;
        this.setresize(this.model.imageid);
        break;
      case "Table":
        //Creates table and returns the table... default create 3*3 table
        var table = this.createTable_Dynamic(this.controlsCount, 3, 3, null, null, null);
        // appends <table> into div
        ev.target.appendChild(table);
        elementId = (this.controlsCount != null) ? "table_" + this.controlsCount : "table_tblDynamic";
        this.model.isImageFileUpload=false;

        //this.selectedItem=elementId;
      this.setresize(elementId);
        break;
      default:
        break;
    }

    //Place the control with x-position and y-position
    var xpos=dragx-$("#"+elementId).offset().left;
    var ypos=dragy-$("#"+elementId).offset().top;

    $("#"+elementId).css('left',xpos)
    $("#"+elementId).css('top',ypos)

    //control in PDFDivContent can be dragged
    if (elementId != null) {
      this.setDragOption(elementId);
      if(elementId.indexOf("table_") != -1)
      {
        var id=$('#'+elementId +' tr:first td:first').attr('id');
        this.selectedDiv(id);
      }
      else
      this.selectedDiv(elementId);
    }
  }

  setFontsizeEnter(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      this.setFontSize();
    }
  };
 
  setWidthEnter(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      this.setWidth();
    }
  };

  setHeightEnter(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      this.setHeight();
    }
  };

  setWidth() {
    var currItem = this.selectedItem;

    if (currItem.indexOf("lblTable_") != -1) {
     $('#' + this.selectedDivItem).width($('#txtWidth').val());
    //  var wid=$('#' + this.selectedDivItem +' input').width()+3;
    //  $('#' + this.selectedDivItem +' input').width(wid);
    }
    if (currItem.indexOf("lbl_") != -1) {
      $('#' + this.selectedDivItem).width($('#txtWidth').val());
    }
    else if (currItem.indexOf("img") != -1) {
      $('#' + this.selectedItem).width($('#txtWidth').val());
      $('#' + this.selectedDivItem).width($('#txtWidth').val());
    }
  }

  setHeight() {
    var currItem = this.selectedItem;

    if (currItem.indexOf("lblTable_") != -1) {
      $('#' + this.selectedDivItem).height($('#txtHeight').val());
     }
    if (currItem.indexOf("lbl_") != -1) {
      $('#' + this.selectedDivItem).height($('#txtHeight').val());
    }
    else if (currItem.indexOf("img") != -1) {
      var wid = $('#' + this.selectedItem).width();
      $('#' + this.selectedItem).height($('#txtHeight').val());
      $('#' + this.selectedDivItem).height($('#txtHeight').val());
    }
  }

  setFontColor() {
    var label = "lbl_";
    var labelOfTable="lblTable_";
    var currItem = this.selectedItem;

    if (currItem.indexOf(label) != -1 ) {
      var appendColor = $("#txtFontColor").val();
      $("#" + this.selectedItem).css("color", appendColor);
    }
    else if(currItem.indexOf(labelOfTable) != -1)
    {
      var headerRowId= $('#'+currItem).closest("tr").attr("id");
      var headerRow="row_0";
      if (headerRowId.indexOf(headerRow) != -1 ) {
        var appendColor = $("#txtFontColor").val();
        $("#" + headerRowId).css("background", appendColor);
      }
    }
  }

  //dynamic control creation events
  createLabel(id, text) {
    var div = document.createElement("DIV");
    div.id = (id != null) ? "divLabel_" + id : "divLabel";
    // creates a label
    var lblId = (id != null) ? "lbl_" + id : "lblDynamic";
    var txtId = (id != null) ? "txt_" + id : "txtDynamic";
    text = (text != null && text != "") ? text : "Your Text Goes Here..";
    div.innerHTML = '<label  style="width:535px;overflow:hidden"  id="' + lblId + '" (click)="EditLabel(this)">' + text + '</label><textarea class="form-control" (focusout)="UpdateLabelText(this)" style="display: none;min-width:150px; min-height:30px;" id="' + txtId + '"></textarea>';
div.style.position="relative" ;
    return div;
  }

  createHeading(id, text) {
    var div = document.createElement("DIV");
    div.id = (id != null) ? "divLabel_" + id : "divLabel";
    // creates a Heading Tag
    var lblId = (id != null) ? "lbl_" + id : "lblDynamic";
    var txtId = (id != null) ? "txtHeading_" + id : "txtHeadingDynamic";
    var headingId = (id != null) ? "heading_" + id : "headingDynamic";
    text = (text != null && text != "") ? text : "Your Heading Goes Here..";
    div.innerHTML = '<label id="' + lblId + '"><h1 id="' + headingId + '" (click)="EditLabel(this)">' + text + '</h1></label><input type="text" (focusout)="UpdateLabelText(this)" style="display: none;" id="' + txtId + '"></input>';
    return div;
  }

  createImage(id, src, alt, width, height) {
    var div = document.createElement("DIV");
    div.id = (id != null) ? "divImage_" + id : "divImage";

    width = (width != undefined && width != null && width != "") ? width : 350; 
    height = (height != undefined && height != null && height != "") ? height : 120;
   
    src=null;
    // create a image
    var imgId = (id != null) ? "img_" + id : "imgDynamic";
    div.innerHTML = '<img id="' + imgId + '"  src="' + src + '" (click)="EditImage(this)" alt="' + alt + '" height="' + height + '" width="' + width + '">';
    $('#' + div.id).attr("width", "500");
    this.model.imageid=imgId;
    return div;
  }

  createTable_Dynamic(Id, rowLength, colLength, tableData, headerColor, fontBold) {
    Id = (Id != undefined && Id != null) ? Id : "tblDynamic";
    headerColor = (headerColor != undefined && headerColor != null) ? headerColor : "	#3CB371";
    fontBold = (fontBold != undefined && fontBold != null && fontBold != "") ? "BOLD" : "";
    tableData = (tableData != undefined && tableData != null) ? tableData : this.lstTableData;
    // creates a <table> element and a <tbody> element
    var tbl = document.createElement("table");
    tbl.id = "table_" + Id;
    tbl.style.margin = '2px';
    var tblBody = document.createElement("tbody");
    var arr=[];
    // creating all cells
    for (var i = 0; i < rowLength; i++) {
      // creates a table row
      var row = document.createElement("tr");
      row.id = "row_" + i + "-" + Id;
      if (i == 0) {
        row.style.backgroundColor = headerColor;
      }
      else {
        headerColor = "";
        fontBold = "";
      }
      for (var j = 0; j < colLength; j++) {
        var cell = document.createElement("td");
        cell.style.alignContent="center";
        cell.id = "cell_" + i + "_" + j + "-" + Id;
        var div = document.createElement("DIV");
        var lblId = "lblTable_" + Id + '-' + i + '_' + j;
        var txtId = "txtTable_" + Id + '-' + i + '_' + j;
        var text = "Label";
        arr[j]=lblId;
        div.innerHTML = '<label style="width:150px;overflow;hidden" id="' + lblId + '" (click)="EditLabel_Table(this)" style="=font-weight:' + fontBold + '">' + text + '</label><input name="table_dynamictextbox" type="text" class="form-control" (focusout)="UpdateLabelText_Table(this)" (keypress)="txtEnterKeyTable($event,this)" style="width:150px;height:33px; display: none; background-color:' + headerColor + ';" id="' + txtId + '"></input>';
        cell.appendChild(div);
        row.appendChild(cell);
      }
      // add the row to the end of the table body
      tblBody.appendChild(row);
    }
    this.selectedItem=arr[0];
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "1");
 tbl.style.position="relative";
    return tbl;
  }

  getValueFromData_Dynamic(id, list) {
    if (list != undefined && list != null) {
      var idArray = id.split("-");
      var obj = list.find(function (obj) { return obj.CellKey == idArray[1]; });
      var value = (obj != undefined && obj != null) ? obj.CellValue : "";
      return value;
    }
    else {
      return "";
    }
  }

  EditLabel(ev) {
    var lblId = ev.id;  //this might be a label id or heading id
    this.selectedItem = lblId;
    var isHeading = false;
    if (lblId.indexOf("heading") != -1) {
      isHeading = true;
    }
    var lblText = ev.innerText;

    var txtId = isHeading ? "txtHeadingDynamic" : "txtDynamic";
    if (lblId.indexOf("_") != -1) {
      var lblArray = lblId.split("_");
      txtId = isHeading ? "txtHeading_" + lblArray[1] : "txt_" + lblArray[1];
    }
    document.getElementById(lblId).style.display = "none";
    var textBox = document.getElementById(txtId);
    textBox.style.display = "block";

    $(textBox).val(lblText);
    textBox.focus();
    var currentdvId = $(ev).closest("div").attr("id");
    this.selectedDivItem = currentdvId;
    //styles will be applied to selected label div
    this.selectedDiv(currentdvId);

    //Display label div width and height in properties
    var width = $("#" + currentdvId).width();
    var height = $("#" + currentdvId).height();
    $("#txtWidth").val(width);
    $("#txtHeight").val(height);

    //Display label font styles in  properties
    var fontWeight = $("#" + this.selectedItem).css('font-weight');
    var fontStyle = $("#" + this.selectedItem).css('font-style');
    if (fontWeight == 'normal' || fontWeight == '400') {
      $("#ddFontStyle").val("normal");
      $("#" + txtId).css('font-weight', 'normal');
      $("#" + txtId).css('font-style', 'normal');
    }
    if (fontWeight == 'bold' || fontWeight == '700') {
      $("#ddFontStyle").val("bold");
      $("#" + txtId).css('font-weight', 'bold');
      $("#" + txtId).css('font-style', 'normal');
    }
    if (fontStyle == 'italic') {
      $("#ddFontStyle").val("italic");
      $("#" + txtId).css('font-weight', 'normal');
      $("#" + txtId).css('font-style', 'italic');
    }

    //Display label color in properties
    var color = $("#" + this.selectedItem).css("color");
    color = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var red = parseInt(color[1]);
    var blue = parseInt(color[2]);
    var green = parseInt(color[3]);
    var mycolor = this.RGB2Color(red, blue, green);
    $("#txtFontColor").val(mycolor);
    $("#" + txtId).css("color", mycolor);

    //Display label font size in properties
    var size = $("#" + this.selectedItem).css('font-size');
    $("#txtFontSize").val(size.replace('px',''));
    $("#" + txtId).css("font-size", size);

    //Display label font family in properties
    var fontFamily = $("#" + this.selectedItem).css('font-family');
    $("#ddFontFamily").val(fontFamily);
    $("#" + txtId).css("font-family", fontFamily);

    //Display alignment in properties
    var alignment =  $("#"+this.selectedItem).css("text-align");
    $("#ddAlignment").val(alignment);
    $("#"+txtId).css("text-align", alignment);

    //Assigning height of textarea to div
    var textArea=$('#'+currentdvId+' textarea').attr('id');
    $('#'+currentdvId).height($('#'+textArea).height()+14);

    //Display line-height in properties
    var lineHeight =  $("#"+this.selectedItem).css('line-height');
    if(lineHeight=="18px")
       $("#ddLineHeight").val(1);
    if(lineHeight=="24px")
       $("#ddLineHeight").val(2);
    if(lineHeight=="32px")
       $("#ddLineHeight").val(3);
   
    $("#"+txtId).css("line-height", lineHeight); 
  }

  EditLabel_Table(ev) {
    var lblId = ev.id;  //this might be a label id or heading id
    this.selectedItem=lblId;
    var isHeading = false;
    if (lblId.indexOf("heading") != -1) {
      isHeading = true;
    }
    var lblText = ev.innerText;
    var txtId = isHeading ? "txtTableHeadingDynamic" : "txtTableDynamic";
    if (lblId.indexOf("lblTable_") != -1) {
      var lblArray = lblId.split("lblTable_");
      txtId = isHeading ? "txtTableHeading_" + lblArray[1] : "txtTable_" + lblArray[1];
    }
    document.getElementById(lblId).style.display = "none";
    var textBox = document.getElementById(txtId);
    textBox.style.display = "block";
    $(textBox).val(lblText);
    textBox.focus();

    var currentdvId = $(ev).closest("td").attr("id");
    this.selectedDivItem = currentdvId;
    //styles will be applied to selected label div
    this.selectedDiv(currentdvId);

    // Display label div width and height in properties
     var width = $("#" + currentdvId).width();
     var height = $("#" + currentdvId).height();
     $("#txtWidth").val(width);
     $("#txtHeight").val(height);

    //Display label color in properties
   var headerRowId=$("#" + this.selectedItem).closest('tr').attr('id');
   var headerRow="row_0";
    if (headerRowId.indexOf(headerRow) != -1 ) {
    var color = $("#" + headerRowId).css("background-color");
    color = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var red = parseInt(color[1]);
    var blue = parseInt(color[2]);
    var green = parseInt(color[3]);
    var mycolor = this.RGB2Color(red, blue, green);

      $("#txtFontColor").val(mycolor);
      $("#" + txtId).css("background-color", mycolor);
  }
   else
   {
    $("#txtFontColor").val('#ffffff');
   }
    
    //Display label font size in properties
    var size = $("#" + this.selectedItem).css('font-size');
    $("#txtFontSize").val(size.replace('px',''));
    $("#" + txtId).css("font-size", size);

    //Display label font family in properties
    var fontFamily = $("#" + this.selectedItem).css('font-family');
    $("#ddFontFamily").val(fontFamily);
    $("#" + txtId).css("font-family", fontFamily);

    //Display label font styles in  properties
    var fontWeight = $("#" + this.selectedItem).css('font-weight');
    var fontStyle = $("#" + this.selectedItem).css('font-style');
    if (fontWeight == 'normal' || fontWeight == '400') {
      $("#ddFontStyle").val("normal");
      $("#" + txtId).css('font-weight', 'normal');
      $("#" + txtId).css('font-style', 'normal');
    }
    if (fontWeight == 'bold' || fontWeight == '700') {
      $("#ddFontStyle").val("bold");
      $("#" + txtId).css('font-weight', 'bold');
      $("#" + txtId).css('font-style', 'normal');
    }
    if (fontStyle == 'italic') {
      $("#ddFontStyle").val("italic");
      $("#" + txtId).css('font-weight', 'normal');
      $("#" + txtId).css('font-style', 'italic');
    }

    //Display alignment in properties
    var alignment =  $("#"+this.selectedItem).css("text-align");
    $("#ddAlignment").val(alignment);
    $("#"+txtId).css("text-align", alignment);
  }

  EditImage(ev) {
    var imgId = ev.id;
    this.selectedItem = imgId;
    var currentdvId = $(ev).closest("div").attr("id");
    var secondParent= $(ev).parent().parent().attr("id");
     this.selectedDivItem = secondParent;

    this.selectedDiv(imgId);

    var width = $("#" + currentdvId).width();
    var height = $("#" + currentdvId).height();

    $("#txtWidth").val(width);
    $("#txtHeight").val(height);
  }

  selectedDiv(ev) {
    $(".selectedClass").removeClass("selectedClass");
    $('#' + ev).addClass("selectedClass");

    if ((this.selectedItem).indexOf('img_') != -1 || (this.selectedItem).indexOf('imgDynamic') != -1) {
      this.model.isImageFileUpload = true;
    }
    else {
      this.model.isImageFileUpload = false; 
    }
  }

  RGB2Color(r, g, b) {
    return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
  }
  byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
  }

  ddFontFamily() {
    var label = "lbl_";
    var labelOfTable="lblTable_";
    var currItem = this.selectedItem;
    if (currItem.indexOf(label) != -1 ) {
      $("#" + this.selectedItem).css('font-family', $('#ddFontFamily').val());
    }
    else if(currItem.indexOf(labelOfTable) != -1)
    {
      var headerRowId= $('#'+currItem).closest("tr").attr("id");
      $("#" + headerRowId).css('font-family', $('#ddFontFamily').val());  
    }
  }

  ddFontStyle() {
    var label = "lbl_";
    var labelOfTable="lblTable_";
    var currItem = this.selectedItem;
    if (currItem.indexOf(label) != -1 ) {
      if ($('#ddFontStyle').val() == 'normal') {
        $("#" + this.selectedItem).css('font-weight', 'normal');
        $("#" + this.selectedItem).css('font-style', 'normal');
      }
      if ($('#ddFontStyle').val() == 'bold') {
        $("#" + this.selectedItem).css('font-weight', 'bold');
        $("#" + this.selectedItem).css('font-style', 'normal');
      }
      if ($('#ddFontStyle').val() == 'italic') {
        $("#" + this.selectedItem).css('font-weight', 'normal');
        $("#" + this.selectedItem).css('font-style', 'italic');
      }
    }
    else if(currItem.indexOf(labelOfTable) != -1)
    {
      var headerRowId= $('#'+currItem).closest("tr").attr("id");
     var headerRow="row_0";
     if (headerRowId.indexOf(headerRow) != -1 ) {
      if ($('#ddFontStyle').val() == 'normal') {
        $("#" + headerRowId).css('font-weight', 'normal');
        $("#" + headerRowId).css('font-style', 'normal');
      }
      if ($('#ddFontStyle').val() == 'bold') {
        $("#" + headerRowId).css('font-weight', 'bold');
        $("#" + headerRowId).css('font-style', 'normal');
      }
      if ($('#ddFontStyle').val() == 'italic') {
        $("#" + headerRowId).css('font-weight', 'normal');
        $("#" + headerRowId).css('font-style', 'italic');
      }
     }  
    }
  }

  setFontSize() {
    var label = "lbl_";
    var labelOfTable="lblTable_";
    var currItem = this.selectedItem;
    if (currItem.indexOf(label) != -1) {
      $("#" + this.selectedItem).css('font-size', $('#txtFontSize').val()+'px');
    }
    else if(currItem.indexOf(labelOfTable) != -1)
    {
      var headerRowId= $('#'+currItem).closest("tr").attr("id");
      $("#" + headerRowId).css('font-size', $('#txtFontSize').val()+'px');
    }
  }

  ddAlignment()
  {
    var label="lbl_";
    var labelOfTable="lblTable_";
    var currItem=this.selectedItem;
    if(currItem.indexOf(label) != -1)
    {
      if ($('#ddAlignment').val()=='left'){
        $("#"+this.selectedItem).css("text-align", "left");
       }
       if ($('#ddAlignment').val()=='center'){
        $("#"+this.selectedItem).css("text-align", "center");
       }
       if ($('#ddAlignment').val()=='right' ){
        $("#"+this.selectedItem).css("text-align", "right");
       }
    }
    else if(currItem.indexOf(labelOfTable) != -1)
    {
      var headerRowId= $('#'+currItem).closest("tr").attr("id");
      var headerRow="row_0";
      if (headerRowId.indexOf(headerRow) != -1 ) {
        if ($('#ddAlignment').val()=='left'){
          $("#"+headerRowId).css("text-align", "left");
         }
         if ($('#ddAlignment').val()=='center'){
          $("#"+headerRowId).css("text-align", "center");
         }
         if ($('#ddAlignment').val()=='right' ){
          $("#"+headerRowId).css("text-align", "right");
         }
      }
      else{
        var tableId= $('#'+headerRowId).closest("table").attr("id");
        if ($('#ddAlignment').val()=='left'){
          $('#'+ tableId+' tbody > tr').not(':first').css("text-align", "left");
         }
         if ($('#ddAlignment').val()=='center'){
          $('#'+ tableId+' tbody > tr').not(':first').css("text-align", "center");
         }
         if ($('#ddAlignment').val()=='right' ){
          $('#'+ tableId+' tbody > tr').not(':first').css("text-align", "right");
         }
      }
     }    
  }

  ddLineHeight()
  {
    var label="lbl_";
    var currItem=this.selectedItem;
    
     // alert(currItem)
    if(currItem.indexOf(label) != -1)
    {
      if ($('#ddLineHeight').val()==1){
        $("#"+this.selectedItem).css("line-height", '18px');
       }
       if ($('#ddLineHeight').val()==2){
        $("#"+this.selectedItem).css("line-height", '24px');
       }
       if ($('#ddLineHeight').val()==3 ){
        $("#"+this.selectedItem).css("line-height", '32px');
       }
    }
  }

  UpdateLabelText(ev) {
    var txtId = ev.id;
    var lblId = "lblDynamic";
    var headingId = "headingDynamic";
    if (txtId.indexOf("_") != -1) {
      var txtArray = txtId.split("_");
      lblId = "lbl_" + txtArray[1];
      headingId = "heading_" + txtArray[1];
    }
    var div=this.selectedDivItem;
    $('#'+div +' label').width($('#'+div).width());
    var textBox = document.getElementById(txtId);
    textBox.style.display = "none";

    var textValue = ev.value == "" ? "Label" : ev.value;
    if (txtId.indexOf("txtHeading") != -1) {
      var heading = document.getElementById(headingId);
      heading.innerText = textValue;
      heading.style.display = "block";
    }
    else {
      var label = document.getElementById(lblId);
      label.style.display = "block";
      label.innerText = textValue;
    }
    $('#'+div).height($('#'+lblId).height()+10);
    //Do the service call and update to Database
  }


  setDragOption(id) {
    $("#" + id).draggable({
      containment: "#divPDFContent",
      scroll: false,
      stop: function (event, ui) {
        // positions[this.id] = ui.position
        // UpdatePosition(this.id, ui.position.top, ui.position.left)
      }
    });
  }

  openNewPage() {
    //this.router.navigateByUrl('/file-upload');
    swal({
      title: "Are you sure?",
      text: "This will lose your changes...",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $('#divpdf').html('');
        
      } else {
      
      }
    });
   
  }
   generate() {
    $(".selectedClass").css({ "border-color": "#ffffff" });
    $(".selectedClass").removeClass("selectedClass");
   
    var element = document.getElementById('divpdf').innerHTML;
    console.log(element);
    var pdf = new jsPDF('p', 'pt', 'a4');
    html2pdf(element, pdf, function (pdf) {
      var string = pdf.output('datauristring');
      var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
      var x = window.open();
      x.document.open();
      x.document.write(iframe);
      x.document.close();
     }
    );
  }
  
  // generate() {
  //   $(".selectedClass").css({ "border-color": "#ffffff" });
  //    $(".selectedClass").removeClass("selectedClass");
 
  //    // var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  //    var mywindow = window.open();
  //    var restorepage = $('#divPDFContent').html();
  //    //var element = document.getElementById('divPDFContent').innerHTML;
  //    //mywindow.document.write('<html><head><title>' + document.title  + '</title>');
  //    mywindow.document.write(restorepage);
  //    mywindow.document.close(); // necessary for IE >= 10
  //    mywindow.focus(); // necessary for IE >= 10*/
 
  //    mywindow.print();
    
  //    mywindow.close();
  //    $('#divPDFContent').html(restorepage);
     
  //    // window.open(element);
  //    // window.print();
  //  }

  uploadFile() {
    $("#fileUploader").click();
  }

  fileChange(event) {
    let filelist: FileList = event.target.files;
    if (filelist.length > 0) {
      let file: File = filelist[0];

      ////Code to Upload file to NodeJS Server.... Modified on 19 Jul 18
      /*let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.model.uploadedImage = file.name;
      // const headers = new Headers();
      // In Angular 5, including the header Content-Type can invalidate your request 

      let options = new RequestOptions();
      options.headers = new Headers();
      options.headers.append('enctype', 'multipart/form-data');
      options.headers.append('Accept', 'application/json');
      
      let endpointFileUpload = this.apiBaseUrl + "fileupload/";

      this.http.post(`${endpointFileUpload}`, formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => console.log('success'),
          error => console.log(error)
        )*/

      /*To Bind the Uploaded image to a file.*/
      // Create the file reader  
      let reader = new FileReader();
      this.readFile(file, reader, (result) => {
      });
    }
  }

  readFile(file, reader, callback) {
    reader.onload = () => {
      callback(reader.result);
      this.model.uploadedImage = reader.result;
       $("#"+this.selectedItem).attr('src',this.model.uploadedImage);
      // console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }

  UpdateLabelText_Table(ev) {
    var txtId = ev.id;
   var tableId=$('#'+txtId).closest("table").attr("id");
  
    var lblId = "lblTableDynamic";
    var headingId = "headingDynamic";
    if (txtId.indexOf("txtTable_") != -1) {
      var txtArray = txtId.split("txtTable_");
      lblId = "lblTable_" + txtArray[1];
      headingId = "heading_" + txtArray[1];
    }

    var textBox = document.getElementById(txtId);
    textBox.style.display = "none";

    var textValue = ev.value == "" ? "Label" : ev.value;
    if (txtId.indexOf("txtHeading") != -1) {
      var heading = document.getElementById(headingId);
      heading.innerText = textValue;
      heading.style.display = "block";
    }
    else {
      var label = document.getElementById(lblId);
      label.style.display = "block";
      label.innerText = textValue; 
    }
    //Do the service call and update to Database
  }

  txtEnterKeyTable(event, control) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    console.log(keycode);
    if (keycode == '13') {
      this.UpdateLabelText_Table(control);
    }

  }

  deleteControl(){
    var labelOfTable="lblTable_";
    var currItem = this.selectedItem;
    if(this.selectedItem!=null)
    {
      if ( currItem.indexOf(labelOfTable) != -1)
      {
        var currentdvId = $('#'+currItem).closest("table").attr("id");
        $("#" + currentdvId).remove();
      }
      else
      $("#" + this.selectedDivItem).remove();
    }
    else
    alert('Please select a control to delete')
  }
  // var labelOfTable="lblTable_";
  // var currItem = this.selectedItem;
  // if(this.selectedItem!=null)
  // {
  //   $("#" + this.selectedDivItem).remove();
  // }
  // else
  // alert('Please select a control to delete')
  // }
}
