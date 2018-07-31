import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { GenerarOrcComponent } from "../generar-orc/generar-orc.component";

@Component({
  selector: "app-ver-opp",
  templateUrl: "./ver-opp.component.html",
  styleUrls: ["./ver-opp.component.css"]
})
export class VerOppComponent implements OnInit {
  displayedColumns = [
    "num",
    "cod",
    "material",
    "unidad",
    "cant",
    "stock",
    "estado"
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public DialogRef: MatDialogRef<VerOppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  generarORC() {
    let dialogRef = this.dialog.open(GenerarOrcComponent, {
      width: "auto"
    });

    dialogRef.beforeClose().subscribe(result => {});
  }

  onNoClick() {
    this.DialogRef.close("close");
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
