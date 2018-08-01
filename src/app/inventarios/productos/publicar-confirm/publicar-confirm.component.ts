import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { InventariosService } from "../../../servicios/almacenes/inventarios.service";
import { takeWhile } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-publicar-confirm",
  templateUrl: "./publicar-confirm.component.html",
  styleUrls: ["./publicar-confirm.component.scss"]
})
export class PublicarConfirmComponent implements OnInit {
  private alive: boolean = true;
  filteredOptions: any = [];
  isLoadingResults: boolean = false;
  stockDisponible: number = 0;
  constructor(
    public DialogRef: MatDialogRef<PublicarConfirmComponent>,
    private inventariosService: InventariosService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  revisarStock(cantidad) {
    console.log(this.data);
    if (cantidad) {
      for (let i = 0; i < this.data.products.length; i++) {
        for (let j = 0; j < this.data.paquete.length; j++) {
          if (this.data.products[i].Nombre == this.data.paquete[j].Nombre) {
            if (
              cantidad * this.data.paquete[j].Cantidad <=
              this.data.products[i].Stock_actual
            ) {
              this.stockDisponible = 2;
            } else {
              this.stockDisponible = 1;
              break;
            }
          }
        }
        if (this.stockDisponible == 1) {
          break;
        }
      }
    } else {
      this.stockDisponible = 0;
    }
  }

  publicarPaq() {
    //this.inventariosService.publicarPaquete();
  }

  onNoClick() {
    this.DialogRef.close("false");
  }
}
