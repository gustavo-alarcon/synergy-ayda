import { Component, OnInit } from "@angular/core";
import { GenerarOrpComponent } from "../generar-orp/generar-orp.component";
import { MatDialog } from "../../../../node_modules/@angular/material";
import { VerOrpComponent } from "../ver-orp/ver-orp.component";
import { GenerarOppComponent } from "../generar-opp/generar-opp.component";
import { VerOppComponent } from "../ver-opp/ver-opp.component";

@Component({
  selector: "principal",
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"]
})
export class PrincipalComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  generarORP() {
    let dialogRef = this.dialog.open(GenerarOrpComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  verORP() {
    let dialogRef = this.dialog.open(VerOrpComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  verOPP() {
    let dialogRef = this.dialog.open(VerOppComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  generarOPP() {
    let dialogRef = this.dialog.open(GenerarOppComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }
}
