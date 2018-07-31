import { ToastrService } from "ngx-toastr";
import { LoginService } from "./../../servicios/login/login.service";
import { element } from "protractor";
import { InventariosService } from "./../../servicios/almacenes/inventarios.service";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  FormArray
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material";
import { ENTER } from "@angular/cdk/keycodes";
import { MatSnackBar } from "@angular/material";

import { Observable } from "rxjs";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";
import { log } from "util";
import { filter, map, startWith, takeWhile } from "rxjs/operators";

const COMMA = 188;

@Component({
  selector: "app-movimientos",
  templateUrl: "./movimientos.component.html",
  styleUrls: ["./movimientos.component.css"]
})
export class MovimientosComponent implements OnInit {
  /*CHIPS*/
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  separatorKeysCodes = [ENTER, COMMA];

  guias: any[] = [];
  guias_string: string = "";

  private alive: boolean = true;
  movimientoForm: FormGroup;

  now: any;
  timeLimit: any;
  uname: string = "";
  tipoMovimiento: string = "Tercero";
  precioPlaceholder: string = "Precio";
  precioCalculado: number = 0;
  precioActual: number = 0;
  idProductoActual: string = "";
  loading: boolean;
  packFlag: boolean = false;

  tempStocks: any[] = [];
  listaResumen: any[] = [];
  documentos: any[] = [];
  numerosSerie: any[][];
  docList: any[] = [];
  docListName: string = "";
  docListSerie: string = "";
  docListCorrelativo: string = "";
  productos: any[] = [];
  productos_filtrado: any[] = [];
  terceros: any[] = [];
  terceros_filtrado: any[] = [];
  almacenes: any[] = [];
  paquetes: any[] = [];
  paquetes_filtrado: any[] = [];
  lista_items_paquete: any[] = [];
  pack_nombre: any[] = [];
  optionDisplay: number = 1;
  montoTotal: number = 0;
  checked: boolean;
  productName: string = null;

  stockData: any = {
    ID: "",
    Cantidad: ""
  };

  documentoData: any = {
    ID: "",
    Correlativo: 0
  };

  perms: any = [];

  filteredOptions: any[];
  filteredPackages: string[];
  numSeries: any[] = [];
  seriesSelected = new FormControl([]);
  formSelectNumSeries: FormGroup;
  numSeriesInProduct: FormArray;
  prodEscogido;
  cantidadMaximaProductos: number = 0;
  isPaquete: boolean = false;

  constructor(
    private inventariosService: InventariosService,
    private loginService: LoginService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.numSeries = [];
    this.formSelectNumSeries = this.fb.group({
      numSeriesArray: this.fb.array([])
    });
    this.loginService.currentUserInfo
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.uname = res[0]["Uname"];
      });

    this.movimientoForm = this.fb.group({
      Documento: ["", Validators.required],
      Serie: ["", Validators.required],
      SerieCompra: ["", Validators.required],
      Correlativo: [{ value: "", disabled: true }, Validators.required],
      Guia: "",
      Fecha: ["", Validators.required],
      Tercero: ["", Validators.required],
      AlmacenOrigen: ["", Validators.required],
      AlmacenDestino: [""],
      Producto: "",
      Paquete: "",
      Cantidad: [
        "",
        [Validators.required, this.ValidateSerie(this.numSeries.length)]
      ],
      Precio: [{ value: "", disabled: false }, Validators.required],
      Usuario: ""
    });

    this.loginService.currentPermissions
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.perms = res;
      });
    this.currentDate();
    this.movimientoForm.patchValue({ Fecha: this.now });

    this.inventariosService.currentLoading
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.loading = res;
        this.cd.markForCheck();
      });

    this.inventariosService.currentDataDocumentos
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.documentos = res;

        if (!this.perms[0]["reg_doc_entrada"]) {
          this.documentos = this.documentos.filter(
            value => value["Naturaleza"] != "ENTRADA"
          );
        }

        if (!this.perms[0]["reg_doc_salida"]) {
          this.documentos = this.documentos.filter(
            value => value["Naturaleza"] != "SALIDA"
          );
        }

        if (!this.perms[0]["reg_doc_transferencia"]) {
          this.documentos = this.documentos.filter(
            value => value["Naturaleza"] != "TRANSFERENCIA"
          );
        }

        if (!this.perms[0]["reg_doc_ajusteEntrada"]) {
          this.documentos = this.documentos.filter(
            value => value["Naturaleza"] != "AJUSTE DE ENTRADA"
          );
        }

        if (!this.perms[0]["reg_doc_ajusteSalida"]) {
          this.documentos = this.documentos.filter(
            value => value["Naturaleza"] != "AJUSTE DE SALIDA"
          );
        }

        this.documentos.sort(this.sortBy("Nombre"));

        let _serie = "";
        this.numerosSerie = [];
        this.documentos.forEach(element => {
          if (
            element["Numtienda"] != _serie &&
            this.numerosSerie.indexOf(element["Numtienda"]) < 0
          ) {
            this.numerosSerie.push(element["Numtienda"]);
            _serie = element["Numtienda"];
          }
        });
      });

    this.getProducts();

    this.inventariosService.currentDataAlmacenes
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.almacenes = res;
        this.almacenes.sort(this.sortBy("Nombre"));
      });

    this.inventariosService.currentDataTerceros
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.terceros = res;
        this.terceros.sort(this.sortBy("Nombre"));
      });

    this.getPackages();

    this.onChanges2();
  }

  createNumSerie(): FormGroup {
    return this.fb.group({
      numSeriesSelected: []
    });
  }

  createNumSeriePackage(paquete?): FormGroup {
    return this.fb.group({
      numSeriesSelected: [],
      paquete: paquete
    });
  }

  addNumSerie(isPackage?): void {
    this.numSeriesInProduct = this.formSelectNumSeries.get(
      "numSeriesArray"
    ) as FormArray;
    if (!isPackage) {
      this.numSeriesInProduct.push(this.createNumSerie());
    } else {
      this.numSeriesInProduct.push(this.createNumSeriePackage(isPackage));
    }
  }

  selectProduct(): void {
    let nombre;
    this.numSeries = [];
    this.isPaquete = false;
    this.seriesSelected.patchValue([]);
    this.productName = this.movimientoForm.get("Producto").value;
    this.pushKeyProducts();
    this.prodActual(this.filteredOptions[0]);
    if (this.optionDisplay == 2) {
      for (let i = 0; i < this.filteredOptions.length; i++) {
        if (this.productName == this.filteredOptions[i].Codigo) {
          nombre = this.filteredOptions[i].Nombre;
          break;
        }
      }
      this.inventariosService
        .getNumSerie(nombre)
        .pipe(takeWhile(() => this.alive))
        .subscribe(data => {
          this.numSeries = data.records;
          this.calculateMaximumProducts();
          this.numSeries.sort(this.dynamicSort("numSerie"));
        });
    } else {
      this.inventariosService
        .getNumSerie(this.productName)
        .pipe(takeWhile(() => this.alive))
        .subscribe(data => {
          this.numSeries = data.records;
          this.calculateMaximumProducts();
          this.numSeries.sort(this.dynamicSort("numSerie"));
        });
    }
  }

  calculateMaximumProducts() {
    this.cantidadMaximaProductos = 0;
    for (let i = 0; i < this.numSeries.length; i++) {
      if (
        this.numSeries[i].almacen ==
        this.movimientoForm.get("AlmacenOrigen").value
      )
        this.cantidadMaximaProductos++;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      var result =
        parseInt(a[property]) < parseInt(b[property])
          ? -1
          : parseInt(a[property]) > parseInt(b[property])
            ? 1
            : 0;
      return result * sortOrder;
    };
  }

  onChanges2(): void {
    this.movimientoForm
      .get("Paquete")
      .valueChanges.pipe(takeWhile(() => this.alive))
      .subscribe(val2 => {
        if (val2 !== "") {
          this.packActual(val2);
        }
      });
  }

  ValidateSerie(cantidadSerie: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value <= cantidadSerie || control.value == null) {
        return { numSerie: true };
      }
      return null;
    };
  }

  getProducts() {
    this.inventariosService.currentDataProductos
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.productos = res;
        this.productos.sort(this.sortBy("Nombre"));
      });
  }

  getPackages() {
    this.inventariosService.currentDataPaquetes
      .pipe(takeWhile(() => this.alive))
      .subscribe(res => {
        this.paquetes = res;
      });
  }

  currentDate() {
    const currentDate = new Date();

    if (31 < 31) {
      if (31 + 1 < 10) {
        if (currentDate.getMonth() + 1 < 10) {
          var limite =
            currentDate.getFullYear() +
            "-0" +
            (currentDate.getMonth() + 1) +
            "-0" +
            ((31 + 1) % 31);
        } else {
          var limite =
            currentDate.getFullYear() +
            "-" +
            (currentDate.getMonth() + 1) +
            "-0" +
            ((31 + 1) % 31);
        }
      } else {
        if (currentDate.getMonth() + 1 < 10) {
          var limite =
            currentDate.getFullYear() +
            "-0" +
            (currentDate.getMonth() + 1) +
            "-" +
            ((31 + 1) % 31);
        } else {
          var limite =
            currentDate.getFullYear() +
            "-" +
            (currentDate.getMonth() + 1) +
            "-" +
            ((31 + 1) % 31);
        }
      }
    } else {
      if (currentDate.getMonth() + 1 < 12) {
        if (((currentDate.getMonth() + 2) % 13) + 1 < 10) {
          var limite =
            currentDate.getFullYear() +
            "-0" +
            (((currentDate.getMonth() + 2) % 13) + 1) +
            "-0" +
            1;
        } else {
          var limite =
            currentDate.getFullYear() +
            "-" +
            (((currentDate.getMonth() + 2) % 13) + 1) +
            "-0" +
            1;
        }
      } else {
        if (((currentDate.getMonth() + 2) % 13) + 1 < 10) {
          var limite =
            currentDate.getFullYear() +
            1 +
            "-0" +
            (((currentDate.getMonth() + 2) % 13) + 1) +
            "-0" +
            1;
        } else {
          var limite =
            currentDate.getFullYear() +
            1 +
            "-" +
            (((currentDate.getMonth() + 2) % 13) + 1) +
            "-0" +
            1;
        }
      }
    }

    this.now = currentDate;
    this.timeLimit = limite;
  }

  sortBy(key) {
    return function(a, b) {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      [];
      return 0;
    };
  }

  addDoc(doc: any, corr: any) {
    this.currentDate();
    this.movimientoForm.patchValue({ Fecha: this.now });

    if (
      (doc != undefined || doc != "") &&
      (this.movimientoForm.value["Serie"] != "" ||
        this.movimientoForm.value["SerieCompra"] != "") &&
      this.movimientoForm.getRawValue()["Correlativo"] != ""
    ) {
      let _exist = false;

      this.docList.forEach(element => {
        if (
          doc["Nombre"] === element["Nombre"] &&
          (this.movimientoForm.value["Serie"] === element["Serie"] ||
            this.movimientoForm.value["SerieCompra"] === element["Serie"]) &&
          doc["Correlativo_actual"] === element["Correlativo"]
        ) {
          _exist = true;
        }
      });
      if (!_exist) {
        this.docList.push({
          Nombre: doc["Nombre"],
          Serie:
            this.tipoMovimiento === "ENTRADA"
              ? this.movimientoForm.value["SerieCompra"]
              : this.movimientoForm.value["Serie"],
          Correlativo: this.movimientoForm.getRawValue()["Correlativo"]
        });
        this.documentoData["ID"] = doc["ID"];
        this.documentoData["Correlativo"] = this.movimientoForm.getRawValue()[
          "Correlativo"
        ];
      } else {
        this.snackBar.open("Documento repetido", "Cerrar", {
          duration: 6000
        });
      }
    } else {
      this.snackBar.open("Completar la información del documento", "Cerrar", {
        duration: 6000
      });
    }
  }

  removeDoc(idx: number) {
    if (this.docList.length > 1) {
      this.docList.splice(idx, 1);
    } else if (idx === 0) {
      this.docList = [];
    }
  }

  filtrarTerceros(tipo: string, nat: string, corr: any) {
    if (this.docList.length < 1) {
      if (nat === "ENTRADA") {
        this.tipoMovimiento = nat;
        this.precioPlaceholder = "Precio de Compra";
        this.movimientoForm.controls["Precio"].enable();
        this.movimientoForm.controls["Correlativo"].enable();
        this.movimientoForm.patchValue({ Serie: 0, SerieCompra: "" });
        this.movimientoForm.controls["SerieCompra"].setErrors(null);
      } else if (nat === "SALIDA") {
        this.tipoMovimiento = nat;
        this.precioPlaceholder = "Precio de Venta";
        this.movimientoForm.controls["Precio"].enable();
        this.movimientoForm.controls["Correlativo"].disable();
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "TRANSFERENCIA") {
        this.tipoMovimiento = nat;
        this.precioPlaceholder = "Transferencia de material";
        this.movimientoForm.controls["Precio"].disable();
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "AJUSTE DE ENTRADA") {
        this.tipoMovimiento = nat;
        this.precioPlaceholder = "Ajuste de entrada";
        this.movimientoForm.controls["Precio"].disable();
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "AJUSTE DE SALIDA") {
        this.tipoMovimiento = nat;
        this.precioPlaceholder = "Ajuste de salida";
        this.movimientoForm.controls["Precio"].disable();
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else {
        this.precioPlaceholder = "Precio";
      }

      this.terceros_filtrado = [];

      this.terceros.forEach(element => {
        if (element["TerceroClass"] === tipo) {
          this.terceros_filtrado.push(element);
        }
      });
    } else {
      if (nat === "ENTRADA") {
        this.movimientoForm.controls["Correlativo"].enable();
        this.movimientoForm.patchValue({ Serie: 0, SerieCompra: "" });
        this.movimientoForm.controls["SerieCompra"].setErrors(null);
      } else if (nat === "SALIDA") {
        this.movimientoForm.controls["Correlativo"].disable();
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "TRANSFERENCIA") {
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "AJUSTE DE ENTRADA") {
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      } else if (nat === "AJUSTE DE SALIDA") {
        this.movimientoForm.patchValue({ Serie: "", SerieCompra: 0 });
        this.movimientoForm.controls["Serie"].setErrors(null);
      }
    }

    this.movimientoForm.patchValue({
      Correlativo: this.tipoMovimiento === "ENTRADA" ? "" : corr
    });
    this.movimientoForm.controls["Correlativo"].setErrors(null);
  }

  filtrarProductos(alm: string) {
    if (
      this.movimientoForm.get("AlmacenDestino").value &&
      this.movimientoForm.get("AlmacenDestino").value == alm
    ) {
      this.movimientoForm.patchValue({ AlmacenDestino: "" });
    }
    if (this.numSeries != []) {
      this.calculateMaximumProducts();
    }
    this.movimientoForm.patchValue({ Cantidad: "" });
    this.productos_filtrado = [];
    this.seriesSelected.patchValue([]);
    this.paquetes_filtrado = [];
    this.productos.forEach(element => {
      if (element["Zona"] === alm) {
        this.productos_filtrado.push(element);
      }
    });

    this.paquetes.forEach(element => {
      if (element["Almacen"] === alm) {
        this.paquetes_filtrado.push(element);
      }
    });

    let _nombre = "";
    this.pack_nombre = [];
    this.paquetes_filtrado.forEach(element => {
      if (element["Paquete"] != _nombre) {
        this.pack_nombre.push(element["Paquete"]);
        _nombre = element["Paquete"];
      }
    });
    this.filteredOptions = this.productos_filtrado;
    this.filteredPackages = this.pack_nombre;
  }

  checkEqualsOrigin() {
    if (
      this.movimientoForm.get("AlmacenOrigen").value &&
      this.movimientoForm.get("AlmacenOrigen").value ==
        this.movimientoForm.get("AlmacenDestino").value
    ) {
      this.movimientoForm.patchValue({ AlmacenDestino: "" });
      this.toastr.warning(
        "El almacen de origen no puedo ser el mismo que el de destino",
        "Cuidado"
      );
    }
  }

  slideToogleChange(e) {
    if (e.checked) {
      this.optionDisplay = 2;
      this.checked = true;
      this.movimientoForm.patchValue({ Producto: "" });
      this.productName = null;
      this.prodEscogido = undefined;
      this.pushKeyProducts();
      this.prodActual(this.prodEscogido);
      this.numSeries = [];
    } else {
      this.optionDisplay = 1;
      this.checked = false;
      this.movimientoForm.patchValue({ Producto: "" });
      this.productName = null;
      this.prodEscogido = undefined;
      this.pushKeyProducts();
      this.prodActual(this.prodEscogido);
      this.numSeries = [];
    }
  }

  pushKeyProducts() {
    this.numSeries = [];
    this.cantidadMaximaProductos = 0;
    this.seriesSelected.patchValue([]);
    this.movimientoForm.patchValue({ Cantidad: "" });
    this.filteredOptions = this.filterProducto(
      this.movimientoForm.value["Producto"]
    );
  }

  pushKeyPackage() {
    this.cantidadMaximaProductos = 0;
    this.formSelectNumSeries = this.fb.group({
      numSeriesArray: this.fb.array([])
    });
    this.movimientoForm.patchValue({ Cantidad: "" });
    this.filteredPackages = this.filterPackage(
      this.movimientoForm.value["Paquete"]
    );
  }

  filterProducto(val): string[] {
    if (this.optionDisplay == 1) {
      return this.productos_filtrado.filter(
        option => option.Nombre.toLowerCase().indexOf(val.toLowerCase()) === 0
      );
    } else {
      return this.productos_filtrado.filter(
        option => option.Codigo.toLowerCase().indexOf(val.toLowerCase()) === 0
      );
    }
  }

  filterPackage(val): string[] {
    return this.pack_nombre.filter(
      option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  prodActual(prod: any) {
    if (prod != undefined) {
      this.prodEscogido = prod;
      this.precioActual = 0;
      if (
        this.tipoMovimiento === "TRANSFERENCIA" ||
        this.tipoMovimiento === "AJUSTE DE ENTRADA" ||
        this.tipoMovimiento === "AJUSTE DE SALIDA"
      ) {
        this.movimientoForm.controls["Precio"].disable();
      } else {
        this.movimientoForm.controls["Precio"].enable();
      }

      this.movimientoForm.patchValue({ Precio: 0 });
      this.movimientoForm.patchValue({ Compra: this.precioActual });
      this.movimientoForm.patchValue({ Cantidad: "" });
      this.packFlag = false;

      if (this.tipoMovimiento === "ENTRADA") {
        this.precioActual = parseFloat(prod.Compra);
      } else if (this.tipoMovimiento === "SALIDA") {
        this.precioActual = parseFloat(prod.Venta);
      }

      this.tempStocks.push({ Producto: prod.Nombre, Stock: prod.Stock_actual });
      this.idProductoActual = prod.Codigo;
    }
  }

  packActual(pack: any) {
    this.precioActual = 0;
    this.isPaquete = true;
    this.formSelectNumSeries = this.fb.group({
      numSeriesArray: this.fb.array([])
    });
    this.movimientoForm.controls["Precio"].disable();
    this.movimientoForm.patchValue({ Precio: 0 });
    this.lista_items_paquete = [];
    this.movimientoForm.patchValue({ Cantidad: "" });
    this.packFlag = true;

    this.paquetes.forEach(element => {
      if (element["Paquete"] === pack) {
        if (this.tipoMovimiento === "ENTRADA") {
          this.precioActual =
            this.precioActual +
            parseFloat(element["Compra"]) * parseFloat(element["Cantidad"]);
        } else if (this.tipoMovimiento === "SALIDA") {
          this.precioActual =
            this.precioActual +
            parseFloat(element["PrecioUnitario"]) *
              parseFloat(element["Cantidad"]);
        }
        this.lista_items_paquete.push({
          Producto: element["Nombre"],
          Cantidad: element["Cantidad"],
          Compra: element["Compra"],
          Venta: element["Venta"],
          Unidad: element["Unidad"],
          Moneda: element["Moneda"],
          PrecioUnitario: element["PrecioUnitario"],
          listNumSeries: []
        });
        this.addNumSerie(element["IDProducto"]);
        this.tempStocks.push({
          Producto: element["Nombre"],
          Stock: element["Stock_actual"]
        });
      }
    });
    let minArray;
    for (let i = 0; i < this.lista_items_paquete.length; i++) {
      this.inventariosService
        .getNumSerie(this.lista_items_paquete[i].Producto)
        .subscribe((data: any) => {
          this.lista_items_paquete[i].listNumSeries = data.records;
          let seriesInAlmacen = 0;
          for (
            let count = 0;
            count < this.lista_items_paquete[i].listNumSeries.length;
            count++
          ) {
            if (
              this.lista_items_paquete[i].listNumSeries[count].almacen ==
              this.movimientoForm.get("AlmacenOrigen").value
            ) {
              seriesInAlmacen++;
            }
          }
          if (i == 0) {
            minArray = Math.trunc(
              seriesInAlmacen / this.lista_items_paquete[i].Cantidad
            );
          } else {
            if (
              Math.trunc(
                seriesInAlmacen / this.lista_items_paquete[i].Cantidad
              ) < minArray
            ) {
              minArray = Math.trunc(
                seriesInAlmacen / this.lista_items_paquete[i].Cantidad
              );
            }
          }
          this.cantidadMaximaProductos = minArray;
        });
    }
  }
  //
  precio(cantidad: number) {
    if (cantidad <= this.cantidadMaximaProductos) {
      if (!this.isPaquete) {
        let arraySeries: any[] = [];
        for (let i = 0; i < this.numSeries.length; i++) {
          if (arraySeries.length == cantidad) {
            break;
          } else {
            if (
              this.numSeries[i].almacen ==
              this.movimientoForm.get("AlmacenOrigen").value
            ) {
              arraySeries.push(this.numSeries[i].numSerie);
            }
          }
        }
        if (
          this.tipoMovimiento === "TRANSFERENCIA" ||
          this.tipoMovimiento === "AJUSTE DE ENTRADA" ||
          this.tipoMovimiento === "AJUSTE DE SALIDA"
        ) {
          this.movimientoForm.patchValue({ Precio: 0 });
          this.seriesSelected.patchValue([]);
        } else {
          if (this.tipoMovimiento == "ENTRADA") {
            this.seriesSelected.patchValue([]);
          } else {
            this.seriesSelected.patchValue(arraySeries);
          }
          this.movimientoForm.patchValue({
            Precio: cantidad * this.precioActual
          });
        }
      } else {
        for (let i = 0; i < this.lista_items_paquete.length; i++) {
          let arraySeries: any[] = [];
          for (
            let j = 0;
            j < this.lista_items_paquete[i].listNumSeries.length;
            j++
          ) {
            if (
              arraySeries.length ==
              cantidad * this.lista_items_paquete[i].Cantidad
            ) {
              break;
            } else {
              if (
                this.lista_items_paquete[i].listNumSeries[j].almacen ==
                this.movimientoForm.get("AlmacenOrigen").value
              ) {
                arraySeries.push(
                  this.lista_items_paquete[i].listNumSeries[j].numSerie
                );
              }
            }
          }
          if (
            this.tipoMovimiento === "TRANSFERENCIA" ||
            this.tipoMovimiento === "AJUSTE DE ENTRADA" ||
            this.tipoMovimiento === "AJUSTE DE SALIDA"
          ) {
            this.movimientoForm.patchValue({ Precio: 0 });
            let numSeriesForm = this.formSelectNumSeries.get(
              "numSeriesArray"
            ) as FormArray;
            numSeriesForm.controls[i].patchValue({
              numSeriesSelected: []
            });
          } else {
            if (this.tipoMovimiento == "ENTRADA") {
              let numSeriesForm = this.formSelectNumSeries.get(
                "numSeriesArray"
              ) as FormArray;
              numSeriesForm.controls[i].patchValue({
                numSeriesSelected: []
              });
            } else {
              let numSeriesForm = this.formSelectNumSeries.get(
                "numSeriesArray"
              ) as FormArray;
              numSeriesForm.controls[i].patchValue({
                numSeriesSelected: arraySeries
              });
            }
            this.movimientoForm.patchValue({
              Precio: cantidad * this.precioActual
            });
          }
        }
      }
    }
  }

  precioIndex(cantidad: number) {
    if (
      this.tipoMovimiento === "TRANSFERENCIA" ||
      this.tipoMovimiento === "AJUSTE DE ENTRADA" ||
      this.tipoMovimiento === "AJUSTE DE SALIDA"
    ) {
      this.movimientoForm.patchValue({ Precio: 0 });
    } else {
      this.movimientoForm.patchValue({
        Precio: cantidad * this.precioActual
      });
    }
  }

  valueSerie() {
    this.movimientoForm.patchValue({
      Cantidad: this.seriesSelected.value.length
    });
    this.precioIndex(this.movimientoForm.value["Cantidad"]);
  }

  onSubmit() {
    this.agregar();
  }

  agregar() {
    if (this.docList.length === 0) {
      this.snackBar.open("Agregue por lo menos un documento", "Cerrar", {
        duration: 6000
      });
      return;
    }
    this.docListName = "";
    this.docListSerie = "";
    this.docListCorrelativo = "";

    this.docList.forEach(element => {
      if (this.docListName.length === 0) {
        this.docListName += element["Nombre"];
        this.docListSerie += element["Serie"];
        this.docListCorrelativo += element["Correlativo"];
      } else {
        this.docListName += ",";
        this.docListName += element["Nombre"];
        this.docListSerie += ",";
        this.docListSerie += element["Serie"];
        this.docListCorrelativo += ",";
        this.docListCorrelativo += element["Correlativo"];
      }
    });

    if (this.packFlag) {
      let numSeriesForm = this.formSelectNumSeries.get(
        "numSeriesArray"
      ) as FormArray;
      this.paquetes.forEach((element, i) => {
        if (this.movimientoForm.value["Paquete"] === element["Paquete"]) {
          for (let j = 0; j < numSeriesForm.controls.length; j++) {
            if (
              numSeriesForm.controls[j].value.paquete == element["IDProducto"]
            ) {
              this.listaResumen.push({
                Fecha: this.movimientoForm.value["Fecha"],
                Documento: this.docListName,
                Serie: this.docListSerie,
                Correlativo: this.docListCorrelativo,
                Tercero: this.movimientoForm.value["Tercero"],
                AlmacenOrigen: this.movimientoForm.value["AlmacenOrigen"],
                AlmacenDestino: this.movimientoForm.value["AlmacenDestino"],
                IDProducto: element["IDProducto"],
                Producto: element["Nombre"],
                Paquete: element["Paquete"],
                Unidad: element["Unidad"],
                Moneda: element["Moneda"],
                esPaquete: 1,
                Cantidad:
                  parseFloat(element["Cantidad"]) *
                  parseFloat(this.movimientoForm.value["Cantidad"]),
                Compra: element["Compra"],
                Venta: element["PrecioUnitario"],
                Movimiento: this.tipoMovimiento,
                Usuario: this.uname,
                Series: numSeriesForm.controls[j].value.numSeriesSelected
              });
            }
          }
        }
      });
    } else if (!this.packFlag) {
      this.listaResumen.push({
        Fecha: this.movimientoForm.value["Fecha"],
        Documento: this.docListName,
        Serie: this.docListSerie,
        Correlativo: this.docListCorrelativo,
        Tercero: this.movimientoForm.value["Tercero"],
        AlmacenOrigen: this.movimientoForm.value["AlmacenOrigen"],
        esPaquete: 0,
        AlmacenDestino: this.movimientoForm.value["AlmacenDestino"],
        IDProducto: this.idProductoActual,
        Producto: this.productName,
        Paquete: this.movimientoForm.value["Paquete"],
        Unidad: this.movimientoForm.value["Producto"]["Unidad"],
        Moneda: this.movimientoForm.value["Producto"]["Moneda"],
        Cantidad: parseFloat(this.movimientoForm.value["Cantidad"]),
        Series: this.seriesSelected.value,
        Compra:
          this.tipoMovimiento === "ENTRADA"
            ? this.movimientoForm.value["Precio"] /
              parseFloat(this.movimientoForm.value["Cantidad"])
            : 0,
        Venta:
          this.tipoMovimiento === "SALIDA"
            ? this.movimientoForm.value["Precio"] /
              parseFloat(this.movimientoForm.value["Cantidad"])
            : 0,
        Movimiento: this.tipoMovimiento,
        Usuario: this.uname
      });
    }
    this.calcMontoTotal();
    this.movimientoForm.patchValue({ Cantidad: "" });
    this.seriesSelected.patchValue([]);
    this.movimientoForm.patchValue({
      Paquete: ""
    });
    this.packActual("");
  }

  calcMontoTotal() {
    this.montoTotal = 0.0;
    this.listaResumen.forEach(element => {
      this.montoTotal =
        this.montoTotal +
        (element.Movimiento === "ENTRADA"
          ? element.Compra * element.Cantidad
          : element.Venta * element.Cantidad);
    });
  }
  io;

  regMovimiento() {
    let _resumen = [];
    let _item = [];
    this.listaResumen.forEach(element => {
      let _idx = _item.indexOf(element["Producto"]);

      if (_idx > -1) {
        _resumen[_idx]["Cantidad"] += parseFloat(element["Cantidad"]);
      } else {
        _resumen.push({
          ID: element["IDProducto"],
          Producto: element["Producto"],
          Paquete: element["Paquete"],
          Cantidad: parseFloat(element["Cantidad"]),
          Origen: element["AlmacenOrigen"],
          Destino: element["AlmacenDestino"],
          esPaquete: element["esPaquete"],
          Series: element["Series"]
        });
        _item.push(element["Producto"]);
      }
    });

    let registrar = true;
    _resumen.forEach(element => {
      this.tempStocks.forEach(_element => {
        if (element["Producto"] === _element["Producto"]) {
          if (
            element["Cantidad"] > _element["Stock"] &&
            this.listaResumen[0]["Movimiento"] === "SALIDA"
          ) {
            let message = "Oops : " + element["Producto"];
            this.snackBar.open(message, "Stock Superado", {
              duration: 4000
            });
            registrar = false;
            return;
          }
        }
      });
    });

    if (this.docList.length == 0) {
      this.snackBar.open("Debe agregar por lo menos un documento", "Cerrar", {
        duration: 6000
      });
      registrar = false;
    }

    if (this.listaResumen.length == 0) {
      this.snackBar.open(
        "No hay productos/paquetes en la lista de resumen",
        "Cerrar",
        {
          duration: 6000
        }
      );
      registrar = false;
    }
    if (registrar) {
      for (let i = 0; i < _resumen.length; i++) {
        for (let j = 0; j < this.productos.length; j++) {
          if (_resumen[i]["esPaquete"] == 0) {
            if (
              _resumen[i]["ID"] == this.productos[j]["Codigo"] &&
              _resumen[i]["Origen"] == this.productos[j]["Zona"]
            ) {
              if (
                this.listaResumen[0]["Movimiento"] === "SALIDA" ||
                this.listaResumen[0]["Movimiento"] === "AJUSTE DE SALIDA"
              ) {
                //this.productos[j]['Stock_actual'] = parseInt(this.productos[j]['Stock_actual']) - parseInt(_resumen[i]['Cantidad']);
                //console.log('Cantidad enviada',this.productos[j]['Stock_actual']);
                //this.inventariosService.modificarProducto(this.productos[j]);
                this.stockData["ID"] = this.productos[j]["ID"];
                this.stockData["Cantidad"] =
                  parseFloat(_resumen[i]["Cantidad"]) * -1;
                this.inventariosService.actualizarStock(this.stockData);
              } else if (
                this.listaResumen[0]["Movimiento"] === "ENTRADA" ||
                this.listaResumen[0]["Movimiento"] === "AJUSTE DE ENTRADA"
              ) {
                //this.productos[j]['Stock_actual'] = parseInt(this.productos[j]['Stock_actual']) + parseInt(_resumen[i]['Cantidad']);
                //console.log('Cantidad enviada',this.productos[j]['Stock_actual']);
                //this.inventariosService.modificarProducto(this.productos[j]);
                this.stockData["ID"] = this.productos[j]["ID"];
                this.stockData["Cantidad"] = parseFloat(
                  _resumen[i]["Cantidad"]
                );
                this.inventariosService.actualizarStock(this.stockData);
              } else if (
                this.listaResumen[0]["Movimiento"] == "TRANSFERENCIA"
              ) {
                if (
                  this.productos[j]["Stock_actual"] >=
                  parseFloat(_resumen[i]["Cantidad"])
                ) {
                  this.inventariosService.transferirProducto(_resumen[i]);
                } else {
                  this.snackBar.open(
                    "No se puede transferir esta cantidad",
                    "Cerrar",
                    {
                      duration: 4000
                    }
                  );
                }
              }
            }
          } else {
            if (
              _resumen[i]["ID"] == this.productos[j]["ID"] &&
              _resumen[i]["Origen"] == this.productos[j]["Zona"]
            ) {
              if (
                this.listaResumen[0]["Movimiento"] === "SALIDA" ||
                this.listaResumen[0]["Movimiento"] === "AJUSTE DE SALIDA"
              ) {
                //this.productos[j]['Stock_actual'] = parseInt(this.productos[j]['Stock_actual']) - parseInt(_resumen[i]['Cantidad']);
                //console.log('Cantidad enviada',this.productos[j]['Stock_actual']);
                //this.inventariosService.modificarProducto(this.productos[j]);
                this.stockData["ID"] = this.productos[j]["ID"];
                this.stockData["Cantidad"] =
                  parseFloat(_resumen[i]["Cantidad"]) * -1;
                this.inventariosService.actualizarStock(this.stockData);
              } else if (
                this.listaResumen[0]["Movimiento"] === "ENTRADA" ||
                this.listaResumen[0]["Movimiento"] === "AJUSTE DE ENTRADA"
              ) {
                //this.productos[j]['Stock_actual'] = parseInt(this.productos[j]['Stock_actual']) + parseInt(_resumen[i]['Cantidad']);
                //console.log('Cantidad enviada',this.productos[j]['Stock_actual']);
                //this.inventariosService.modificarProducto(this.productos[j]);
                this.stockData["ID"] = this.productos[j]["ID"];
                this.stockData["Cantidad"] = parseFloat(
                  _resumen[i]["Cantidad"]
                );
                this.inventariosService.actualizarStock(this.stockData);
              } else if (
                this.listaResumen[0]["Movimiento"] == "TRANSFERENCIA"
              ) {
                if (
                  this.productos[j]["Stock_actual"] >=
                  parseFloat(_resumen[i]["Cantidad"])
                ) {
                  this.inventariosService.transferirProducto(_resumen[i]);
                } else {
                  this.snackBar.open(
                    "No se puede transferir esta cantidad",
                    "Cerrar",
                    {
                      duration: 4000
                    }
                  );
                }
              }
            }
          }
        }
      }

      let message = "Guardando movimiento ...";
      this.snackBar.open(message, "Genial!", {
        duration: 4000
      });
      this.getProducts();
      this.getPackages();
      this.inventariosService.registrarMovimiento(this.listaResumen);
      this.inventariosService.actualizarCorrelativo(this.documentoData);
      this.limpiarLista();
      this.docList = [];
      this.docListName = "";
      this.docListSerie = "";
      this.docListCorrelativo = "";
      this.movimientoForm.patchValue({
        Documento: "",
        Serie: "",
        Correlativo: "",
        AlmacenOrigen: "",
        Producto: "",
        Paquete: "",
        AlmacenDestino: "",
        Tercero: "",
        Cantidad: ""
      });
      this.seriesSelected.patchValue([]);
      this.formSelectNumSeries = this.fb.group({
        numSeriesArray: this.fb.array([])
      });
      this.productName = null;
      this.prodEscogido = undefined;
      this.lista_items_paquete = [];
      this.movimientoForm.controls["Serie"].setErrors(null);
      this.movimientoForm.controls["Documento"].setErrors(null);
      this.movimientoForm.controls["Cantidad"].setErrors(null);
      this.movimientoForm.controls["Tercero"].setErrors(null);
      this.movimientoForm.controls["AlmacenOrigen"].setErrors(null);
    }
  }

  limpiarLista() {
    this.listaResumen = [];
    this.calcMontoTotal();
  }

  sumarCantidad(idx: number) {
    this.inventariosService
      .getNumSerie(this.listaResumen[idx]["Producto"])
      .takeWhile(() => this.alive)
      .subscribe(data => {
        let series = data.records;
        let exists;
        series.sort(this.dynamicSort("numSerie"));
        for (let i = 0; i < series.length; i++) {
          exists = true;
          for (let j = 0; j < this.listaResumen[idx]["Series"].length; j++) {
            if (series[i].numSerie == this.listaResumen[idx]["Series"][j]) {
              exists = false;
              break;
            }
            if (series[i].almacen != this.listaResumen[idx]["AlmacenOrigen"]) {
              exists = false;
              break;
            }
          }
          if (exists) {
            this.listaResumen[idx]["Series"].push(series[i].numSerie);
            this.listaResumen[idx]["Cantidad"] += 1;
            this.cd.markForCheck();
            return;
          }
        }
        this.toastr.error(
          "No se puede agregar mas ya que supera el stock",
          "Error"
        );
      });
    this.calcMontoTotal();
  }

  restarCantidad(idx: number) {
    if (this.listaResumen[idx]["Cantidad"] > 0) {
      this.listaResumen[idx]["Series"].pop();
      this.listaResumen[idx]["Cantidad"] -= 1;
      this.calcMontoTotal();
      this.cd.markForCheck();
    }
  }

  borrarItem(idx: number) {
    this.listaResumen.splice(idx, 1);
    this.calcMontoTotal();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.alive = false;
  }
}
