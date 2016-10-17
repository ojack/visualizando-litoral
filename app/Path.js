/*utility functions for calculating path*/
import Settings from './settings.json';

class Path {
  static reverse(points){
    return points.reverse();
  }

  static calculateOffset(points, offset, index, boundsCheck){
    /*translate by difference between old starting point and new*/
     // 
   if(points.length > index){
    if(boundsCheck){
      if(offset.x > Settings.size.w/2) offset.x -= Settings.size.w;
      if(offset.x < -Settings.size.w/2) offset.x += Settings.size.w;
      if(offset.y > Settings.size.h/2) offset.y -= Settings.size.h;
      if(offset.y < -Settings.size.h/2) offset.y += Settings.size.h;
    }
    var off = {x: offset.x-points[index].x, y: offset.y-points[index].y}

    return points.map(function(pt){
      var newPt = this.addPolarCoords({x: pt.x + off.x, y: pt.y + off.y, size: pt.size});
      // if(newPt.x > window.innerWidth) newPt.x -= window.innerWidth;
      // if(newPt.x < 0) newPt.x += window.innerWidth;
      // if(newPt.y > window.innerHeight) newPt.y -= window.innerHeight;
      // if(newPt.y < 0) newPt.y += window.innerHeight;
      return newPt;
    }.bind(this));
   } else {
    return points;
   }
    
  }


  /* create continuous line */
  static addNextPoint(points){
    if(points.length >= 2){
      var off = {x: points[1].x-points[0].x, y: points[1].y-points[0].y};
      var newPt = {x: points[points.length-1].x + off.x, y: points[points.length-1].y + off.y, size: points[1].size};
     
     /* TO DO : if ENTIRE line outside bounds, offset all points. but what about large shapes?? split lines?c*/
      // if(newPt.x > Settings.size.w/2) newPt.x -= Settings.size.w;
      // if(newPt.x < -Settings.size.w/2) newPt.x += Settings.size.w;
      // if(newPt.y > Settings.size.h/2) newPt.y -= Settings.size.h;
      // if(newPt.y < -Settings.size.h/2) newPt.y += Settings.size.h;

      points.splice(0, 1);
      points.push(this.addPolarCoords(newPt));
      return points;
    } else {
      return points;
    }
  }

  static calculatePolarOffset(points, o, index){
    //console.log("calc offset", o);
    var p = this.toPolar(o);
    

    var offset = this.addPolarCoords(o);
    if(points.length > index){
     // console.log("original point", points[index]);
      var off = {theta: offset.theta - points[index].theta, r: offset.r - points[index].r};
     // console.log("difference", off);
      return points.map(function(pt){
        var newPt = this.addRectCoords({r: pt.r + off.r, theta: pt.theta + off.theta, size: pt.size});
       // var newPt = this.addRectCoords({theta: pt.theta + off.theta, r: pt.r});
        return newPt;
      }.bind(this));
    } else {
      return points;
    }
  }

  static addRectCoords(pt){
    var rect = this.toRect(pt);
    pt.x = rect.x;
    pt.y = rect.y;
    return pt;
  }

  static toRect(pt){
    var x = pt.r*Math.cos(pt.theta);
    var y = pt.r*Math.sin(pt.theta);
    return ({x: x, y: y});
  }

  static addPolarCoords(pt){
    //console.log("point", pt);
    var polar = this.toPolar(pt);
   // console.log("polar", polar);
    pt.theta = polar.theta;
    pt.r = polar.r;
    return pt;
  }

  static toPolar(pt){
    var theta = Math.atan2(pt.y , pt.x);
    var r = Math.sqrt(pt.x*pt.x + pt.y*pt.y);
    return ({theta: theta, r: r});
  }
}

export default Path;
