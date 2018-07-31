import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { CrearClienteProduccionComponent } from "./crear-cliente-produccion/crear-cliente-produccion.component";

@Component({
  selector: "app-generar-opp",
  templateUrl: "./generar-opp.component.html",
  styleUrls: ["./generar-opp.component.css"]
})
export class GenerarOppComponent implements OnInit {
  inputFile = {
    selectButton: {
      "background-color": "#fff",
      "border-radius": "10px",
      color: "#000"
    },
    clearButton: {
      "background-color": "#FFF",
      "border-radius": "10px",
      color: "#000",
      "margin-left": "10px"
    },
    layout: {
      "background-color": "#dadada",
      //"border-radius": "25px",
      color: "#888",
      "font-size": "10px",
      margin: "15px"
    },
    previewPanel: {
      "background-color": "#888",
      "border-radius": "0 0 10px 10px",
      display: "flex",
      "justify-content": "center"
    }
  };
  newImage;

  constructor(
    public DialogRef: MatDialogRef<GenerarOppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  addClient() {
    let dialogRef = this.dialog.open(CrearClienteProduccionComponent, {
      width: "auto",
      data: "text",
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.getClients();
      }
    });
  }

  onNoClick() {
    this.DialogRef.close("close");
  }

  imageFinishedUploading(file) {
    this.newImage = file.file;
  }

  onRemoved() {
    this.newImage = null;
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
