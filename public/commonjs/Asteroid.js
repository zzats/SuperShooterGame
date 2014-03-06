/**
 * Created by Ville on 27.2.2014.
 */

(function (exports) {

    exports.Asteroid = Asteroid;

    function Asteroid(radius, position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.mass = radius*10000;
        this.alive = true;
        this.health = 1000;
        this.restitution = 0.5;
        this.regenerationRate = 0.1;

    }

    Asteroid.prototype.toJSON = function () {
        return {
            x: this.position.x,
            y: this.position.y,
            vx: this.velocity.x,
            vy: this.velocity.y,
            radius: this.radius,
            mass: this.mass,
            health: this.health
        }
    }

    Asteroid.prototype.setJSON = function(data) {
        this.position = new Vector(data.x,data.y);
        this.velocity = new Vector(data.vx,data.vy);
        this.radius = data.radius;
        this.health = data.health;
        this.mass = data.mass;
    }

    Asteroid.prototype.move = function(timeDelta) {
        this.position = this.position.add(this.velocity.multiply(timeDelta/1000));
    }

    Asteroid.prototype.update = function() {
        if(this.health < mass) {
            this.health += this.regenerationRate;
        }
    }

    Asteroid.prototype.getPosition = function() {
        return this.position;
    }


    Asteroid.prototype.getVelocity = function() {
        return this.velocity;
    }

    Asteroid.prototype.collision = function(otherObject) {

        var otherPosition = otherObject.getPosition();
        var otherVelocity = otherObject.getVelocity();

        var dx = this.position.x-otherPosition.x;
        var dy = this.position.y-otherPosition.y;
        var dl = Math.sqrt(dx*dx+dy*dy);
        console.log("dl", dl);
        var mtd_x = dx*(((this.radius + otherObject.radius)-dl)/dl);
        var mtd_y = dy*(((this.radius + otherObject.radius)-dl)/dl);
        var im1 = 1 / this.mass;
        var im2 = 1 / otherObject.mass;
        this.position.x += mtd_x*(im1 / (im1 + im2));
        this.position.y += mtd_y*(im1 / (im1 + im2));
        otherPosition.x -= mtd_x*(im2 / (im1 + im2));
        otherPosition.y -= mtd_y*(im2 / (im1 + im2));
        var i_vel_x = this.velocity.x - otherVelocity.x;
        var i_vel_y = this.velocity.y - otherVelocity.y;
        var vn = i_vel_x*(mtd_x/dl) + i_vel_y*(mtd_y/dl);
        if(vn > 0.0) return;
        var i = (-(1.0 + this.restitution) * vn) / (im1 + im2);
        var imp_x = mtd_x * i;
        var imp_y = mtd_y * i;
        this.velocity.x += imp_x*im1*10;
        this.velocity.y += imp_y*im1*10;
        otherVelocity.x -= imp_x*im2*10;
        otherVelocity.y -= imp_y*im2*10;

        var jumpBackDistanceX = 1;
        if(otherVelocity.x> 0) {
            jumpBackDistanceX = -jumpBackDistanceX;
        }
        var jumpBackDistanceY = 1;
        if(otherVelocity.y > 0) {
            jumpBackDistanceY = -jumpBackDistanceY;
        }
        otherObject.pos_x += jumpBackDistanceX;
        otherObject.pos_y += jumpBackDistanceY;
        otherObject.vel_x = -otherObject.vel_x*0.5+1;
        otherObject.vel_y = -otherObject.vel_y*0.5+1;


    }



})(typeof exports === 'undefined' ? this['Asteroid'] = {} : exports);