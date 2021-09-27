import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {
  getGenreStat,
  getFavoriteGenre,
  filterStatistics
} from '../utils/stats.js';
import {
  FilterType,
  SortStatisticType,
  MINUTES_IN_HOUR
} from '../const.js';
import {
  filter
} from '../utils/filter';

const renderGenreChart = (container, films) => {
  const genreStat = getGenreStat(films);
  const labelArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0) {
      return key;
    }
  });
  const dataArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0) {
      return genreStat[key];
    }
  });

  const chart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labelArray,
      datasets: [{
        data: dataArray,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        barThickness: 24,
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return chart;
};

const createStatisticsTemplate = (data, sort) => {
  const films = data;
  const durationInMinutes = films.reduce((total, element) => (total + element.duration), 0);
  const durationInHours = Math.floor(durationInMinutes / MINUTES_IN_HOUR);
  const remainderInMinutes = durationInMinutes - (durationInHours * MINUTES_IN_HOUR);

  const genreStat = getGenreStat(films);
  const favoriteGenre = getFavoriteGenre(genreStat);

  return `<section class='statistic'>
    <p class='statistic__rank'>
      Your rank
      <img class='statistic__img' src='images/bitmap@2x.png' alt='Avatar' width='35' height='35'>
      <span class='statistic__rank-label'>Movie buff</span>
    </p>
    <form action='https://echo.htmlacademy.ru/' method='get' class='statistic__filters'>
      <p class='statistic__filters-description'>Show stats:</p>
      <input type='radio' class='statistic__filters-input visually-hidden' name='statistic-filter' id='statistic-all-time' value='${SortStatisticType.ALL_TIME}' ${(sort === SortStatisticType.ALL_TIME) ? 'checked' : ''}>
      <label for='statistic-all-time' class='statistic__filters-label'>All time</label>
      <input type='radio' class='statistic__filters-input visually-hidden' name='statistic-filter' id='statistic-today' value='${SortStatisticType.TODAY}' ${(sort === SortStatisticType.TODAY) ? 'checked' : ''}>
      <label for='statistic-today' class='statistic__filters-label'>Today</label>
      <input type='radio' class='statistic__filters-input visually-hidden' name='statistic-filter' id='statistic-week' value='${SortStatisticType.WEEK}' ${(sort === SortStatisticType.WEEK) ? 'checked' : ''}>
      <label for='statistic-week' class='statistic__filters-label'>Week</label>
      <input type='radio' class='statistic__filters-input visually-hidden' name='statistic-filter' id='statistic-month' value='${SortStatisticType.MONTH}' ${(sort === SortStatisticType.MONTH) ? 'checked' : ''}>
      <label for='statistic-month' class='statistic__filters-label'>Month</label>
      <input type='radio' class='statistic__filters-input visually-hidden' name='statistic-filter' id='statistic-year' value='${SortStatisticType.YEAR}' ${(sort === SortStatisticType.YEAR) ? 'checked' : ''}>
      <label for='statistic-year' class='statistic__filters-label'>Year</label>
    </form>
    <ul class='statistic__text-list'>
      <li class='statistic__text-item'>
        <h4 class='statistic__item-title'>You watched</h4>
        <p class='statistic__item-text'>${films.length}<span class='statistic__item-description'>movies</span></p>
      </li>
      <li class='statistic__text-item'>
        <h4 class='statistic__item-title'>Total duration</h4>
        ${(films.length > 0) ? `<p class='statistic__item-text'>${durationInHours} <span class='statistic__item-description'>h</span> ${remainderInMinutes} <span class='statistic__item-description'>m</span></p>` : '<p class=\'statistic__item-text\'>0</p>'}
      </li>
      <li class='statistic__text-item'>
        <h4 class='statistic__item-title'>Top genre</h4>
        ${(films.length > 0) ? `<p class='statistic__item-text'>${favoriteGenre}</p>`: ''}
      </li>
    </ul>
    <div class='statistic__chart-wrap'>
      <canvas class='statistic__chart' width='1000'></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._watchedFilm = this._getMovies();
    this._filtredFilm = this._getSortingMovies();
    this._activeSort = 'statistic-all-time';
    this._createStatisticBlock = null;
    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filtredFilm, this._activeSort);
  }

  getNewTemplate() {
    const sortValue = document.querySelector('.statistic__filters-input[checked]').getAttribute('value');
    return createStatisticsTemplate(this._filtredFilm, sortValue);
  }

  restoreHandlers() {
    this._setCharts();
    this.setFilterChangeStatistic();
  }

  setFilterChangeStatistic() {
    this._radioCollection = this.getElement().querySelectorAll('.statistic__filters-input');
    this._radioCollection.forEach((sortItem) => {
      sortItem.addEventListener('change', (evt) => {
        console.log('1');
        this._oldChecked = this.getElement().querySelector('.statistic__filters-input[checked]');
        this._oldChecked.removeAttribute('checked');
        evt.target.setAttribute('checked', 'checked');
        evt.target.checked = true;
        this._filtredFilm = this._getSortingMovies();
        this._updateScreen();
      });
    });
  }

  _getMovies() {
    const watchedMovie = filter[FilterType.WATCHLIST](this._films);
    return watchedMovie;
  }

  _getSortingMovies() {
    const sortValue = (document.querySelector('.statistic__filters-input[checked]')) ? document.querySelector('.statistic__filters-input[checked]').getAttribute('value') : 'statistic-all-time';
    this._filtredFilm = filterStatistics[sortValue](this._watchedFilm);
    return this._filtredFilm;
  }

  _setCharts() {
    if (this._createStatisticBlock !== null) {
      this._createStatisticBlock = null;
    }
    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._filtredFilm = this._getSortingMovies();
    const genreStat = getGenreStat(this._filtredFilm);
    const genreStatCount = Object.keys(genreStat).length;
    statisticCtx.height = BAR_HEIGHT * genreStatCount;
    this._genreCart = renderGenreChart(statisticCtx, this._filtredFilm);
  }

  _updateScreen() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getNewElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }
}
