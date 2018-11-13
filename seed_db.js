(async () => {
  const config = require('config');
  const mongoose = require('mongoose');
  const Exercise = require('./models/exercise');
  const Muscle = require('./models/muscle');
  const User = require('./models/user');
  const Workout = require('./models/workout');
  const CompletedExercise = require('./models/completed_exercise');
  const bcrypt = require('bcrypt');

  const db = config.get('db');
  mongoose.connect(db, { useNewUrlParser: true });
  await Exercise.deleteMany({});
  await Muscle.deleteMany({});
  await User.deleteMany({});
  await Workout.deleteMany({});
  await CompletedExercise.deleteMany({});
  let collection = [];

  function exercise_items(array, muscle) {
    for (let item of array) {
      collection.push({ name: item, muscle_id: muscle._id });
    }
    return collection
  }

  const front_neck = await new Muscle({ name: "front-neck" }).save();
  const deltoids = await new Muscle({ name: "deltoids" }).save();
  const biceps = await new Muscle({ name: "biceps" }).save();
  const pectorals = await new Muscle({ name: "pectorals" }).save();
  const obliques = await new Muscle({ name: "obliques" }).save();
  const abdominals = await new Muscle({ name: "abdominals" }).save();
  const quadriceps = await new Muscle({ name: "quadriceps" }).save();
  const hip_adductors = await new Muscle({ name: "hip adductors" }).save();
  const tibialis_anterior = await new Muscle({ name: "tibialis anterior" }).save();
  const upper_trapezius = await new Muscle({ name: "upper trapezius" }).save();
  const lower_trapezius = await new Muscle({ name: "lower trapezius" }).save();
  const posterior_deltoids = await new Muscle({ name: "posterior deltoids" }).save();
  const infraspinatus = await new Muscle({ name: "infraspinatus" }).save();
  const triceps = await new Muscle({ name: "triceps" }).save();
  const latissimus_dorsi = await new Muscle({ name: "latissimus dorsi" }).save();
  const lower_back = await new Muscle({ name: "lower back" }).save();
  const glutes = await new Muscle({ name: "glutes" }).save();
  const hamstrings = await new Muscle({ name: "hamstrings" }).save();
  const calves = await new Muscle({ name: "calves" }).save();
  const front_forearms = await new Muscle({ name: "front-forearms" }).save();
  const back_forearms = await new Muscle({ name: "back-forearms" }).save();

  const quad_exercises = [
    "back squat",
    "front squat",
    "jump squat",
    "pistol squat",
    "depth jumps",
    "box jumps",
    "running vertical jumps",
    "standing vertical jumps"
  ];
  const hamstring_exercises = [
    "romanian deadlift",
    "sumo deadlift",
    "deadlift",
    "leg curl",
    "glute-ham raise",
    "nordic ham curl"
  ];
  const calf_exercises = [ "standing calf raise", "steated calve raise" ];
  const pectoral_exercises = [
    "incline bench press",
    "flat bench press",
    "chest fly"
  ];
  const lat_exercises = [
    "wide-grip front lat pulldown",
    "close-grip front lat pulldown",
    "chin up",
    "pull up",
    "bent-over row",
    "seated row"
  ];
  const lower_back_exercises = [ "back extension" ];
  const deltoid_exercises = [
    "seated overhead press",
    "standing overhead press",
    "lateral raise",
    "front raise"
  ];
  const posterior_deltoid_exercises = [ "reverse fly" ];
  const tricep_exercises = [
    "push down",
    "triceps extension",
    "close-grip bench press",
    "dip"
  ];
  const bicep_exercises = [
    "hammer curl",
    "bicep curl",
    "incline curl",
    "preacher curl"
  ];
  const ab_exercises = [ "crunch" ];
  const front_neck_exercises = [ "neck curl" ];
  const upper_trap_exercises = [ "neck extension" ];
  const glute_exercises = [ "bench hip thrust", "hip thrust" ];

  exercise_items(quad_exercises, quadriceps);
  exercise_items(hamstring_exercises, hamstrings);
  exercise_items(calf_exercises, calves);
  exercise_items(pectoral_exercises, pectorals);
  exercise_items(lat_exercises, latissimus_dorsi);
  exercise_items(lower_back_exercises, lower_back);
  exercise_items(deltoid_exercises, deltoids);
  exercise_items(posterior_deltoid_exercises, posterior_deltoids);
  exercise_items(tricep_exercises, triceps);
  exercise_items(bicep_exercises, biceps);
  exercise_items(ab_exercises, abdominals);
  exercise_items(front_neck_exercises, front_neck);
  exercise_items(upper_trap_exercises, upper_trapezius);
  exercise_items(glute_exercises, glutes);

  await Exercise.collection.insertMany(collection);

  const salt = await bcrypt.genSalt(10);
  const password_digest = await bcrypt.hash("123456", salt);
  const user = await new User({ name: "Adam", email: "adam@example.com", password_digest }).save();
  const back_squat = await Exercise.findOne({name: 'back squat'});
  const flat_bench_press = await Exercise.findOne({name: 'flat bench press'});
  const chin_up = await Exercise.findOne({name: 'chin up'});
  const lateral_raise = await Exercise.findOne({name: 'lateral raise'});
  const leg_curl = await Exercise.findOne({name: 'leg curl'});

  for (let i = 1; i < 32; i++) {
    let workout = await new Workout({ date: new Date(`October ${i}, 2018`), user_id: user._id }).save();

    await new CompletedExercise({
      exercise_id: back_squat._id,
      workout_id: workout._id,
      exercise_type: 'free weight',
      unilateral: false,
      sets: 5,
      reps: 5,
      load: 225,
      mum: false
    }).save();

    await new CompletedExercise({
      exercise_id: flat_bench_press._id,
      workout_id: workout._id,
      exercise_type: 'free weight',
      unilateral: false,
      sets: 4,
      reps: 8,
      load: 185,
      mum: true
    }).save();

    await new CompletedExercise({
      exercise_id: chin_up._id,
      workout_id: workout._id,
      exercise_type: 'bodyweight',
      unilateral: false,
      sets: 4,
      reps: 8,
      load: 0,
      mum: false
    }).save();

    await new CompletedExercise({
      exercise_id: lateral_raise._id,
      workout_id: workout._id,
      exercise_type: 'cable',
      unilateral: false,
      sets: 4,
      reps: 10,
      load: 12,
      mum: false
    }).save();

    await new CompletedExercise({
      exercise_id: leg_curl._id,
      workout_id: workout._id,
      exercise_type: 'machine',
      unilateral: true,
      sets: 4,
      reps: 10,
      load: 75,
      mum: false
    }).save();
  }

  mongoose.connection.close();
})();
