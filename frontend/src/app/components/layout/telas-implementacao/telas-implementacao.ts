import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wrench } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-telas-implementacao',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './telas-implementacao.html',
  styleUrls: ['./telas-implementacao.scss']
})
export class TelasImplementacao {
  readonly Wrench = Wrench;
}