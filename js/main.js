(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

// Portfolio: HOME uses smooth slider (3 at a time, no loop)
// Projects page (project.html) keeps your Isotope paging grid.
(function () {
  var $portfolioContainer = $('.portfolio-container'); // your old selector (projects page)
  var track = document.getElementById('portfolioTrack'); // new slider track (home)

  // Detect listing page (your existing logic)
  var pathname = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
  var isProjectsPage =
    pathname.indexOf('project') !== -1 ||
    (document.querySelector('.page-header h1') && /projects/i.test(document.querySelector('.page-header h1').textContent));

  var itemsPerPage = isProjectsPage ? 8 : 3; // projects page: 2 rows of 4

  var currentFilter = '*';
  var currentPage = 0;

  var $prevBtn = $('#portfolio-prev');
  var $nextBtn = $('#portfolio-next');
  var $pageInfo = $('#portfolio-pageinfo');

  function setBtnState($btn, disabled) {
    $btn.toggleClass('is-disabled', disabled);
    $btn.attr('aria-disabled', disabled ? 'true' : 'false');
  }

  // ---------------------------
  // HOME: Smooth slider mode
  // ---------------------------
  function initHomeSlider() {
    var allItems = Array.from(track.querySelectorAll('.portfolio-item'));

    function cardsPerView() {
      // Match the CSS breakpoints
      if (window.matchMedia('(max-width: 767.98px)').matches) return 1;
      if (window.matchMedia('(max-width: 991.98px)').matches) return 2;
      return 3;
    }

    function matchedItems() {
      if (currentFilter === '*') return allItems.filter(el => !el.classList.contains('is-hidden'));
      var cls = currentFilter.replace('.', '');
      return allItems.filter(el => el.classList.contains(cls) && !el.classList.contains('is-hidden'));
    }

    function totalPages() {
      var m = matchedItems().length;
      return Math.max(1, Math.ceil(m / cardsPerView()));
    }

    function applyFilter() {
      // show/hide items
      allItems.forEach(function (el) {
        if (currentFilter === '*') {
          el.classList.remove('is-hidden');
          return;
        }
        var cls = currentFilter.replace('.', '');
        el.classList.toggle('is-hidden', !el.classList.contains(cls));
      });
    }

    function scrollToPage(page) {
      var m = matchedItems();
      var per = cardsPerView();
      var maxPage = totalPages() - 1;

      currentPage = Math.max(0, Math.min(page, maxPage));

      var targetIndex = currentPage * per;
      var targetEl = m[targetIndex];

      if (targetEl) {
        // scroll so that targetEl is aligned to the start
        track.scrollTo({ left: targetEl.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }

    function updatePagerUI() {
      var t = totalPages();
      if (currentPage < 0) currentPage = 0;
      if (currentPage > t - 1) currentPage = t - 1;

      $pageInfo.text((currentPage + 1) + ' / ' + t);
      setBtnState($prevBtn, currentPage === 0);
      setBtnState($nextBtn, currentPage >= t - 1);
    }

    function refresh() {
      applyFilter();
      // If filter reduced pages, clamp page
      var maxPage = totalPages() - 1;
      if (currentPage > maxPage) currentPage = maxPage;

      updatePagerUI();
      scrollToPage(currentPage);
    }

    // Filters
    $('#portfolio-flters').on('click', 'li[data-filter]', function () {
      $('#portfolio-flters li').removeClass('active');
      $(this).addClass('active');

      currentFilter = $(this).data('filter');
      currentPage = 0;
      refresh();
    });

    // Pager buttons
    $prevBtn.on('click', function () {
      if ($(this).hasClass('is-disabled')) return;
      scrollToPage(currentPage - 1);
      updatePagerUI();
    });

    $nextBtn.on('click', function () {
      if ($(this).hasClass('is-disabled')) return;
      scrollToPage(currentPage + 1);
      updatePagerUI();
    });

    // Initial
    window.addEventListener('resize', function () {
      // keep the “page” consistent when columns change
      refresh();
    });

    $(window).on('load', function () {
      $('#portfolio-flters li[data-filter="*"]').addClass('active');
      refresh();
    });
  }

  // ---------------------------
  // PROJECTS PAGE: Your existing Isotope mode
  // (kept almost exactly as-is)
  // ---------------------------
  function initIsotopePaging() {
    if (!$portfolioContainer.length) return;

    var currentFilterISO = '*';
    var currentPageISO = 0;

    var $allItems = $portfolioContainer.find('.portfolio-item');

    var portfolioIsotope = $portfolioContainer.isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows',
      transitionDuration: '0.55s',
      hiddenStyle: { opacity: 0, transform: 'translateY(14px)' },
      visibleStyle: { opacity: 1, transform: 'translateY(0px)' }
    });

    function getMatchedItems(filter) {
      if (filter === '*') return $allItems;
      return $allItems.filter(filter);
    }

    function totalPagesFor(filter) {
      var matchedCount = getMatchedItems(filter).length;
      var pages = Math.ceil(matchedCount / itemsPerPage);
      return Math.max(1, pages);
    }

    function updatePagerUI() {
      var totalPages = totalPagesFor(currentFilterISO);

      if (currentPageISO < 0) currentPageISO = 0;
      if (currentPageISO > totalPages - 1) currentPageISO = totalPages - 1;

      $pageInfo.text((currentPageISO + 1) + ' / ' + totalPages);

      setBtnState($prevBtn, currentPageISO === 0);
      setBtnState($nextBtn, currentPageISO >= totalPages - 1);
    }

    function applyFilterAndPage() {
      var $matched = getMatchedItems(currentFilterISO);
      var start = currentPageISO * itemsPerPage;
      var end = start + itemsPerPage;

      var showSet = new Set($matched.slice(start, end).get());

      portfolioIsotope.isotope({
        filter: function () {
          return showSet.has(this);
        }
      });

      updatePagerUI();
    }

    $('#portfolio-flters').on('click', 'li[data-filter]', function () {
      $('#portfolio-flters li').removeClass('active');
      $(this).addClass('active');

      currentFilterISO = $(this).data('filter');
      currentPageISO = 0;
      applyFilterAndPage();
    });

    $prevBtn.on('click', function () {
      if ($(this).hasClass('is-disabled')) return;
      currentPageISO--;
      applyFilterAndPage();
    });

    $nextBtn.on('click', function () {
      if ($(this).hasClass('is-disabled')) return;
      currentPageISO++;
      applyFilterAndPage();
    });

    $(window).on('load', function () {
      $('#portfolio-flters li[data-filter="*"]').addClass('active');
      applyFilterAndPage();
      setTimeout(function () { $portfolioContainer.isotope('layout'); }, 50);
    });
  }

  // Decide which mode to run
  if (!isProjectsPage && track) {
    initHomeSlider();          // smooth slide (what you want)
  } else {
    initIsotopePaging();       // keep grid behavior on project listing
  }

}());

})(jQuery);

