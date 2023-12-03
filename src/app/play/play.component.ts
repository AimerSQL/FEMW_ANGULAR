import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { UfoBattleService } from '../shared/services/ufo-battle.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit, OnDestroy {
  @ViewChild('container') containerElement!: ElementRef;
  @ViewChild('missile') missileElement!: ElementRef;
  @ViewChild('points') pointsElement!: ElementRef;
  @ViewChild('time') timeElement!: ElementRef;

  storedRangeValue: string ='1' ;
  selectedTime: string = '60';
  score: number = 0;
  ufoCount: number = 1;
  missilelaunched: boolean = false;
  pid: number | undefined;
  interval: any;
  timeInterval: any;
  finishTime :number = 0
  gameOver: boolean = false;


  constructor(private renderer: Renderer2,
    private conex: UfoBattleService) {}

  ngOnInit() {
    const storedRangeValue = localStorage.getItem('rangePreference');
    const storedSelectedTime = localStorage.getItem('timePreference');

    if (storedRangeValue) {
      this.storedRangeValue = storedRangeValue;
    }

    if (storedSelectedTime) {
      this.selectedTime = storedSelectedTime;
    }
  }

  ngAfterViewInit() {
    if (this.storedRangeValue !== null) {
      this.ufoCount = parseInt(this.storedRangeValue);
      this.setUFOCount(this.ufoCount);
    } else {
      this.setUFOCount(this.ufoCount);
    }

    document.addEventListener(
      'keydown',
      this.keyboardController.bind(this),
      false
    );

    this.UFOlaunch();

    this.finishTime = parseInt(this.selectedTime);
    this.startTimer();
  }

  
  UFOlaunch() {
    let numUFO = parseInt(this.storedRangeValue);
    for (let i = 1; i <= numUFO; i++) {
      setInterval(() => {
        this.moveUFO('ufo_' + i);
      }, 25);
    }
  }


  startTimer() {
    this.timeInterval = setInterval(() => {
      this.finishTime--;
      this.timeElement.nativeElement.innerHTML = this.finishTime.toString() + "s";

      if (this.finishTime <= 0) {
        this.calculateScore();
        this.missilelaunched = true;
        clearInterval(this.timeInterval);
        this.timeElement.nativeElement.innerHTML = "game over";
        this.gameOver = true;
        alert("game over")
      }
    }, 1000);
  }

  moveUFO(ufoId: string) {
    var Rlimit = window.innerWidth;
    var ufo = this.containerElement.nativeElement.querySelector('#' + ufoId);

    var hpos_ufo = parseInt(ufo.style.left || '0'),
      width_ufo = parseInt(ufo.style.width || '0'),
      ufo_hstep = parseInt(ufo.getAttribute('data-hstep') || '5');

    if (hpos_ufo + width_ufo + 8 > Rlimit || hpos_ufo < 0) {
      ufo_hstep = ufo_hstep * -1;
      this.renderer.setAttribute(ufo, 'data-hstep', ufo_hstep.toString());
    }

    hpos_ufo = hpos_ufo + ufo_hstep;
    this.renderer.setStyle(ufo, 'left', hpos_ufo + 'px');
  }

  pullTrigger() {
    this.missilelaunched = true;
    this.pid = setInterval(() => {
      this.launch();
    }, 10) as any;
  }

  checkForHit(ufoId: string): string | null {
    var ufo = this.containerElement.nativeElement.querySelector('#' + ufoId);
    if (!ufo || !this.missileElement) return null;

    var hpos_ufo = parseInt(ufo.style.left),
      vpos_ufo = parseInt(ufo.style.bottom),
      width_ufo = parseInt(ufo.style.width),
      vpos_m = parseInt(this.missileElement.nativeElement.style.bottom),
      hpos_m = parseInt(this.missileElement.nativeElement.style.left),
      width_m = parseInt(this.missileElement.nativeElement.style.width),
      height_m = parseInt(this.missileElement.nativeElement.style.height),
      hit =
        vpos_m + height_m >= vpos_ufo &&
        vpos_m <= vpos_ufo &&
        hpos_m + width_m / 2 >= hpos_ufo &&
        hpos_m + width_m / 2 <= hpos_ufo + width_ufo;

    if (hit) return ufoId;
    return null;
  }

  launch() {
    var uLimit = window.innerHeight,
      vpos_m,
      vstep = 5;

    if (!this.missileElement) return;

    vpos_m = parseInt(this.missileElement.nativeElement.style.bottom);
    var hitUFOId =
      this.checkForHit('ufo_1') ||
      this.checkForHit('ufo_2') ||
      this.checkForHit('ufo_3') ||
      this.checkForHit('ufo_4') ||
      this.checkForHit('ufo_5');

    if (hitUFOId !== null) {
      clearInterval(this.pid);
      this.missilelaunched = false;
      this.missileElement.nativeElement.style.bottom = 0 + 'px';

      this.score = this.score + 100;
      const pointsElement = this.pointsElement.nativeElement;
        pointsElement.innerHTML = this.score.toString();


      var hitUFO = this.containerElement.nativeElement.querySelector('#' + hitUFOId);
      if (hitUFO) {
        hitUFO.setAttribute('src', '../../assets/imgs/explosion.gif');
        setTimeout(() => {
          if (hitUFO)
          hitUFO.setAttribute('src', '../../assets/imgs/ufo.png');
        }, 1000);
      }
    } else {
      if (vpos_m < uLimit) {
        vpos_m = vpos_m + vstep;
      } else {
        clearInterval(this.pid);
        this.missilelaunched = false;
        vpos_m = 0;
        this.score = this.score - 25;
        const pointsElement = this.pointsElement.nativeElement;
        if (pointsElement) {
          pointsElement.innerHTML = this.score.toString();
        }
      }

      this.missileElement.nativeElement.style.bottom = vpos_m + 'px';
    }
  }

  moveMissileRight() {
    var rLimit = window.innerWidth,
      hpos_m,
      misWidth,
      hstep = 5;
    hpos_m = parseInt(this.missileElement.nativeElement.style.left);
    misWidth = parseInt(this.missileElement.nativeElement.style.width);

    if (hpos_m + misWidth + 8 < rLimit) {
      hpos_m = hpos_m + hstep;
      this.missileElement.nativeElement.style.left = hpos_m + 'px';
    }
  }

  moveMissileLeft() {
    var hstep = 5,
      hpos_m;
      hpos_m = parseInt(this.missileElement.nativeElement.style.left);
      var misWidth = parseInt(this.missileElement.nativeElement.style.width);

      if (hpos_m > 0) {
        hpos_m = hpos_m - hstep;
        this.missileElement.nativeElement.style.left = hpos_m + 'px';
      }

  }

  keyboardController(event: KeyboardEvent) {
    let code = event.key;

    if (!this.missilelaunched) {
      switch (code) {
        case 'ArrowRight':
          this.moveMissileRight();
          break;
        case 'ArrowLeft':
          this.moveMissileLeft();
          break;
        case ' ':
          this.pullTrigger();
          break;
      }
    }
  }

  setUFOCount(count: number) {
    for (let i = 1; i <= count; i++) {
      this.createUFO(i);
    }
  }

  createUFO(index: number) {
    let rLimit = window.innerWidth,
      uLimit = window.innerHeight,
      newleft = parseInt((Math.random() * rLimit).toString()),
      minBottom = 150,
      maxBottom = uLimit - 50,
      newbottom = Math.max(minBottom, Math.random() * (maxBottom - minBottom));

    let ufoId = 'ufo_' + index;
    let newelement = this.renderer.createElement('img');
    newelement.setAttribute('src', '../../assets/imgs/ufo.png');
    newelement.setAttribute('class', 'setOfUfos');
    newelement.setAttribute('id', ufoId);
    newelement.setAttribute('data-hstep', '5');
    this.renderer.setStyle(newelement, 'left', newleft + 'px');
    this.renderer.setStyle(newelement, 'bottom', newbottom + 'px');
    this.renderer.setStyle(newelement, 'width', '60px');
    this.renderer.appendChild(this.containerElement.nativeElement, newelement);
  }

  calculateScore() {
    let finalScore = this.score;
    let minutes = Math.ceil(parseInt(this.selectedTime || '0') / 60);

    if (minutes > 0) {
      finalScore /= minutes;
    } else {
      return;
    }

    let extraUFOs = this.ufoCount - 1;
    if (extraUFOs > 0) {
      finalScore -= extraUFOs * 50;
    }

    const pointsElement = this.pointsElement.nativeElement;
    if (pointsElement) {
      pointsElement.innerHTML = finalScore.toString();
      this.score = finalScore;
    }
  }

  save() {
    const finalScore = this.score;
    const storedRangeValue = parseInt(this.storedRangeValue);
    const storedSelectedTime = parseInt(this.selectedTime);
  
    this.conex.save(finalScore, storedRangeValue, storedSelectedTime).subscribe(
      () => {
        console.log('Record saved successfully:');
      },
      (error) => {
        console.error('Error saving record:', error);
      }
    );
  }
  

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);
  }
}
