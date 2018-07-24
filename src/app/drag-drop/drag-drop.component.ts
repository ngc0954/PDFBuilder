import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements OnInit {

  constructor() { 
    
  }
  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data=ev.dataTransfer.getData("text");
    if(data=="lblTxt")
    {
      var label=$("#lbl").text();
      alert(label);
      //$("#lbl").style="display: none;";
    var div = document.createElement("DIV");
    div.innerHTML = '<label id="lblDynamic" onclick="EditLabel(this)"><h3>Your text comes here</h3></label><input type="text" onblur="UpdateLabelText(this)" style="display: none;" id="txtDynamic"></input>';
      ev.target.append(div);
    }
    if(data=="lblImage")
    {
      var src = "http://www.w3schools.com/html/img_w3slogo.gif";
      // create a image
      var img = document.createElement("img");
      img.setAttribute('src', src);
      img.setAttribute('alt', "Image");
      img.width = 300;
      img.height = 60;

      // ev.target.append('This is Image area');
      ev.target.appendChild(img);
    }
    if(data=="lblHeading")
    {
      var div = document.createElement("DIV");
      div.innerHTML = '<label id="lblHeading"><h3>This is Heading</h3></label>';
        ev.target.append(div);
    }

    if(data=="lblTable") {
      var divTable = document.createElement("DIV");
      var rowLength=3;
      var colLength=3;
      var tableData=null;

      divTable.id = "lblTable";
     
      // creates a <table> element and a <tbody> element
      var tbl = document.createElement("table");
      tbl.id = "tblDynamic";
      tbl.style.margin = '2px';
      var tblBody = document.createElement("tbody");
      // creating all cells
      for (var i = 0; i < rowLength; i++) {
          // creates a table row
          var row = document.createElement("tr");
  
          for (var j = 0; j < colLength; j++) {
              // Create a <td> element and a text box, make the text
              // node the contents of the <td>, and put the <td> at
              // the end of the table row
              var cell = document.createElement("td");
              var div = document.createElement("DIV");
              div.innerHTML = '<input name="dynamictextbox" type="text" style="text-align:center;" value=""  ></input>';
              cell.appendChild(div);
              row.appendChild(cell);
          }
          // add the row to the end of the table body
          tblBody.appendChild(row);
      }
      // put the <tbody> in the <table>
      tbl.appendChild(tblBody);
      // sets the border attribute of tbl to 2;
      tbl.setAttribute("border", "2");
      //add table to a div
      divTable.appendChild(tbl);
      ev.target.append(divTable);
  }
  }

  ngOnInit() {
  }

}
