import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
})
export class EmptyComponent implements OnInit {
  @Input() img: string = "assets/imgs/empty.png";
  @Input() text: string = "Nessuna informazione rilevante trovata";
  constructor() { }

  ngOnInit() { }

}
