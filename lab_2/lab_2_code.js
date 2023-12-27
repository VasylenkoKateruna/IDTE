let marker_visible = { targets.mind };

AFRAME.registerComponent("registerevents", {
    init: function () {
        var marker = this.el;
        marker.addEventListener('markerFound', function () {
            console.log('Знайдено маркер ', marker.id);
            marker_visible[marker.id] = true;
        });
        marker.addEventListener('markerLost', function () {
            console.log('Втрачено маркер ', marker.id);
            marker_visible[marker.id] = false;
        });
    }
});
