import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { LoginService } from "../servicios/login/login.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from "@angular/animations";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
  animations: [
    trigger("menuInOut", [
      transition(
        ":enter",
        animate(
          "500ms ease-out",
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 1, offset: 1.0 })
          ])
        )
      ),
      transition(
        ":leave",
        animate(
          "500ms ease-out",
          keyframes([
            style({ opacity: 1, offset: 0 }),
            style({ opacity: 0.5, offset: 0.5 }),
            style({ opacity: 0, offset: 1.0 })
          ])
        )
      )
    ])
  ]
})
export class LandingComponent implements OnInit {
  username: string = "Usuario";
  perms: any = [{}];
  menu: string = "close";
  false: boolean = false;
  constructor(
    private loginService: LoginService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loginService.currentPermissions.subscribe(res => {
      this.perms = res;
    });
  }

  openMenu() {
    this.menu = this.menu == "close" ? "open" : "close";
    this.cd.markForCheck();
  }

  createPage() {
    localStorage.setItem("page", "1");
  }
}
