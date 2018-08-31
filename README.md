| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |




|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/users|POST|create a new user|No|
/api/users|GET|return all users|Yes|
/api/users/me|GET|return current user|No|
/api/users/me|PUT|update current user|No|
/api/users/:id|DELETE|delete a user|Yes|

|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/workouts|POST|create a new workout|No|
/api/workouts|GET|return all workouts for current user|No|
/api/workouts/:id|GET|return a specific workout for current user|No|
/api/workouts/:id|PUT|update a specific workout for current user|No|
/api/workouts/:id|DELETE|delete a specific workout for current user|No|
/api/workouts/:id/completed_exercises|POST|create a new completed_workout for a specific workout for current user|No|

|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/completed_exercises/:id|GET|return a specific completed_exercise for current user|No|
/api/completed_exercises/:id|PUT|update a specific completed_exercise for current user|Yes|
/api/completed_exercises/:id|DELETE|delete a specific completed_exercise for current user|No|

|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/exercises|POST|create a new exercise|Yes|
/api/exercises|GET|return all exercises|No|
/api/exercises/:id|GET|return a specific exercise|Yes|
/api/exercises/:id|PUT|update a specific exercises|Yes|
/api/exercises/:id|DELETE|delete a specific exercise|Yes|

|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/muscles|POST|create a new muscle|Yes|
/api/muscles|GET|return all muscles|No|
/api/muscles/:id|GET|return a specific muscle|Yes|
/api/muscles/:id|PUT|update a specific muscle|Yes|
/api/muscles/:id|DELETE|delete a specific muscle|Yes|

|URL|HTTP verb|Result|Admin only?|
|---|---|---|
/api/login|POST|return a new JSON web token that can be used to identify the current user|No|
