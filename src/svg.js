/** @jsx React.DOM */

var FilledMixin = {
    getStyle: function() {
        return {
            fill: this.props.isSelected ? this.props.selectedColor : this.props.unselectedColor
        };
    }
};

/**
 * Properties:
 *      xPos - x coordinate of the upper left corner
 *      yPos - y coordinate of the upper right corner
 *      width
 *      height
 *      isSelected
 *      selectedColor
 *      unselectedColor
 */
var Rect = React.createClass({
    mixins: [FilledMixin],

    getDefaultProps: function() {
        return {
            isSelected: false,
            selectedColor: '#0000ff',
            unselectedColor: '#ffff00'
        };
    },

    render: function() {
        return (
            <rect
                x={this.props.xPos}
                y={this.props.yPos}
                width={this.props.width}
                height={this.props.height}
                style={this.getStyle()}
            />
        );
    }
});

/**
 * Properties:
 *      xPos - the x coordinate of the center of the drag handle
 *      yPos - the y coordinate of the center of the drag handle
 *      [width]
 *      [height]
 *      [isSelected]
 *      [isVisible]
 *      [selectedColor]
 *      [unselectedColor]
 */
var DragHandle = React.createClass({
    mixins: [FilledMixin],

    // Callbacks
    
    getDefaultProps: function() {
        return {
            width: 5,
            height: 5,
            isSelected: true,
            isVisible: true,
            selectedColor: '#000000',
            unselectedColor: '#eeeeee'
        };
    },

    render: function() {
        if (!this.props.isVisible) {
            // As of React 0.11rc we can return `null` to render nothing.
            return null;
        }

        var drawX = this.props.xPos - (this.props.width / 2);
        var drawY = this.props.yPos - (this.props.height / 2);

        return (
            <rect
                x={drawX}
                y={drawY}
                width={this.props.width}
                height={this.props.height}
                style={this.getStyle()}
            />
        );
    }

});

/**
 * Properties:
 *      initialRects
 *      [selectedColor]
 *      [unselectedColor]
 * State:
 *      rects
 */
var Selection = React.createClass({

    getStyle: function() {
        return {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            'z-index': -1
        };
    },

    setBoundingRects: function(rects) {
        selection.setState({rects: rects});
    },

    appendBoundingRect: function(rect) {
        this.setBoundingRects(this.state.rects.concat([rect]));
    },

    prependBoundingRect: function(rect) {
        this.setBoundingRects([rect].concat(this.state.rects));
    },

    setLastBoundingRect: function(rect) {
        this.setBoundingRects(this.state.rects.slice(0,-1).concat([rect]));
    },

    setFirstBoundingRect: function(rect) {
        this.setBoundingRects([rect].concat(this.state.rects.slice(1,-1)));
    },

    // Callbacks

    getDefaultProps: function() {
        return {
            selectedColor: 'red',
            unselectedColor: 'blue'
        };
    },

    getInitialState: function() {
        return {
            rects: this.props.initialRects
        };
    },

    render: function() {
        var self = this;
        var rectNodes = this.state.rects.map(function(rect) {
            var x = rect[0];
            var y = rect[1];
            var w = rect[2];
            var h = rect[3];
            return (
                <Rect xPos={x} yPos={y} width={w} height={h} />
            );
        });

        // Drag handle locations
        var iLast = this.state.rects.length - 1;
        var startDragHandleX = this.state.rects[0][0];
        var startDragHandleY = this.state.rects[0][1] + (this.state.rects[0][3] / 2);
        var endDragHandleX = this.state.rects[iLast][0] + this.state.rects[iLast][2];
        var endDragHandleY = this.state.rects[iLast][1] + (this.state.rects[iLast][3] / 2);

        return (
            <svg id="app" xmlns="http://www.w3.org/2000/svg" version="1.1"
                viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
                style={this.getStyle()}>
                {rectNodes}
                <DragHandle xPos={startDragHandleX} yPos={startDragHandleY} />
                <DragHandle xPos={endDragHandleX} yPos={endDragHandleY} />
            </svg>
        );
    }
});

var i = 0;
var delta = 1;
var rectLists = [
    [
        [20, 10, 40, 10],
        [10, 25, 50, 10],
        [10, 40, 30, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 50, 10],
        [10, 40, 20, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 50, 10],
        [10, 40, 10, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 50, 10],
        [10, 40, 0, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 50, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 40, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 30, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 20, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 10, 10]
    ],
    [
        [20, 10, 40, 10],
        [10, 25, 0, 10]
    ],
    [
        [20, 10, 40, 10],
    ],
    [
        [20, 10, 30, 10],
    ],
    [
        [20, 10, 20, 10],
    ],
    [
        [20, 10, 10, 10],
    ],
    [
        [20, 10, 0, 10],
    ],
];

var selection = React.renderComponent(
    <Selection initialRects={rectLists[0]} />,
    document.getElementById('app')
);

var changeSelection = function(e) {
    if (i >= rectLists.length - 1) {
        delta = -1;
    } else if (i <= 0) {
        delta = 1;
    }
    i += delta;
    selection.setBoundingRects(rectLists[i]);
}

setInterval(changeSelection, 100);
