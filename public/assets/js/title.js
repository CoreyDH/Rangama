 $(function() {
     if($('.title-wrapper').length > 0) {
        var x = 0;
        setInterval(function(){
            x-=2;
            $('.title-wrapper').css('background-position', x + 'px 0');
        }, 10);

        $("#scott, #ramona").animateSprite({
            fps: 6,
            autoplay: true,
            animations: {
                walkRight: [0, 1, 2, 3, 4, 5, 6, 7],
                walkLeft: [15, 14, 13, 12, 11, 10, 9, 8]
            },
            loop: true
        });

        $("#scott").animateSprite('play', 'walkRight');

        $("#ramona").animateSprite('play', 'walkRight');

        $('#standard').on('click', function() {
            window.location.href = $(this).find('a').attr('href');
        });
    }
 });