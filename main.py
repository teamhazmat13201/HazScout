from flask import *
from flask_socketio import SocketIO, join_room, leave_room, send

import requests as r




season = '2024'


def get_data(teamNum):

    body = '''query {
  teamByNumber(number: '''+str(teamNum)+''') {
    number
    name
    schoolName
    sponsors
    location {
      city
      state
      country
    }
    quickStats(season:2024){
      tot{
        value
        rank
      }
      auto{
        value
        rank
      }
      dc{
        value
        rank
      }
      eg{
        value
        rank
      }
    }
    matches(season: 2024) {
      matchId
      alliance
      match {
        scores {
          ... on MatchScores2024 {
            red {
              autoPark1
              autoPark2
              autoSampleNet
              autoSampleLow
              autoSampleHigh
              autoSpecimenLow
              autoSpecimenHigh
              dcPark1
              dcPark2
              dcSampleNet
              dcSampleLow
              dcSampleHigh
              dcSpecimenLow
              dcSpecimenHigh
              autoPoints
              dcPoints
              totalPoints
            }
            blue {
              autoPark1
              autoPark2
              autoSampleNet
              autoSampleLow
              autoSampleHigh
              autoSpecimenLow
              autoSpecimenHigh
              dcPark1
              dcPark2
              dcSampleNet
              dcSampleLow
              dcSampleHigh
              dcSpecimenLow
              dcSpecimenHigh
              autoPoints
              dcPoints
              totalPoints
            }
          }
        }
        event {
          code
          name
          location {
            city
            state
          }
        }
      }
    }
    rookieYear
    awards(season:2024){
      type
      event{name, code}
    }
    website
  }
}


'''
    try:
        response = r.post('https://api.ftcscout.org/graphql', json = {'query': body})
        print(response.json())
        return response.json()['data']
    except:
        return render_template('/error.html')






app = Flask(__name__)

socketio = SocketIO(app)


@app.route('/')
def homepage():
    return render_template('/homepage.html')

@app.route('/search', methods = ['POST', 'GET'])
def search():
    if request.method == 'POST':
        global data
        data = get_data(request.form.get('teamNumber'))

        try:
            return redirect('/form-submit')
        except:
            return render_template('/error.html')
    return render_template('/form_input.html')



@app.route('/form-submit', methods = ['POST', 'GET'])
def form_submit():
     try:
        return render_template('/form_submit.html', data = data)
     except:
         return render_template('/error.html')

@app.route('/record-data')
def record_data():
    return render_template('/record_data.html')



@app.route('/None')
def none():
    return render_template('/none.html')


@app.route('/prediction', methods=['POST', 'GET'])
def match_prediction():
    try:
        global winning_alliance
        if request.method == 'POST':
            team1 = request.form.get('teamNumber1')
            team2 = request.form.get('teamNumber2')
            team3 = request.form.get('teamNumber3')
            team4 = request.form.get('teamNumber4')

            team1OPR = get_data(team1)['teamByNumber']['quickStats']['tot']['value']
            team2OPR = get_data(team2)['teamByNumber']['quickStats']['tot']['value']
            team3OPR = get_data(team3)['teamByNumber']['quickStats']['tot']['value']
            team4OPR = get_data(team4)['teamByNumber']['quickStats']['tot']['value']

            if team1OPR + team2OPR > team3OPR + team4OPR:
                winning_alliance = 'blue'
            elif team1OPR + team2OPR < team3OPR + team4OPR:
                winning_alliance = 'red'
            else:
                winning_alliance = 'tie'

            print(winning_alliance)
            return redirect('/prediction-results')
        return render_template('/match_prediction.html')  # Ensure page loads without error
    except:
        return render_template('/error.html')


@app.route('/prediction-results', methods = ['POST', 'GET'])
def prediction_results():
    return render_template('match_prediction_results.html', winning_alliance = winning_alliance)








@socketio.on('join')
def handle_join(data):
    room = data.get('room')

    if room:
        join_room(room)

        session['room'] = room

        print(f'a test user has joined room {room}')



@socketio.on('data')
def handle_data(data):
    print("Received data:", data)
    send(data, room = session.get('room'),broadcast=True)


@socketio.on('data-request')
def data_request(data):
    room = data['room']
    socketio.emit('data-response', room = room, include_self = False)



app.run()
