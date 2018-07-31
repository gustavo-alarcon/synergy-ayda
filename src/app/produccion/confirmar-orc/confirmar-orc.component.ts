import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-confirmar-orc",
  templateUrl: "./confirmar-orc.component.html",
  styleUrls: ["./confirmar-orc.component.css"]
})
export class ConfirmarOrcComponent implements OnInit {
  constructor(
    public DialogRef: MatDialogRef<ConfirmarOrcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {}

  onNoClick() {
    this.DialogRef.close("close");
  }

  onSubmit() {
    this.DialogRef.close("true");
  }
}
