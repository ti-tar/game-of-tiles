# game-of-tiles

### v 2.0:
- Переписано из div'ов на таблицы
- Числа в ячейках случайные для понимания какая колонка/ряд удаляются
- Теперь ячейки не перерендериваются каждый раз наново, а добавляются-удаляются только нужные теги


    *                 .top-arrow
    *                 topArrow
    *              ----------------
    * .left-arrow  |  table       | .right-arrow
    * leftArrow    |  table       | rightArrow
    *              ----------------
    *                 .bottom-arrow
    *                 bottomArrow
    
    
