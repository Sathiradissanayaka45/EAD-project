package com.example.train_booking;

import static android.content.ContentValues.TAG;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class RequestActivity extends AppCompatActivity {

    TextView trainName;
    TextView startFrom;
    TextView startTime;
    Button btn;

    String train;
    String start;
    String departure;
    String time;

    //use local storage
    SharedPreferences myPreferences;

    private final String url = "http://10.0.2.2:5101/api/all-users";
    private final String requestUrl = "http://10.0.2.2:5101/api/booking/assistance";
    private  String assistantName = "";

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_request);
        myPreferences = PreferenceManager.getDefaultSharedPreferences(RequestActivity.this);
        getRequestTravelAgents();

        //GET params passed from parent
        Intent intent = getIntent();
        train = intent.getStringExtra("train");
        start = intent.getStringExtra("start");
        departure = intent.getStringExtra("departure");
        time = intent.getStringExtra("time");

        System.out.println("train " + train);

        trainName = findViewById(R.id.requestTxtTrain);
        startFrom = findViewById(R.id.requestTxtStart);
        startTime = findViewById(R.id.requestTxtStartTime);
        btn = findViewById(R.id.requestBtnAssistant);

        if(assistantName.isEmpty()){
            btn.setEnabled(false);
        }

        trainName.setText(train + "\n");
        startFrom.setText(start + " to " + departure);
        startTime.setText(time + "\n");

        btn.setOnClickListener(v -> {
            try {
                submitRequest();
                Toast.makeText(this, "Successfully Requested." , Toast.LENGTH_LONG).show();
                Intent myIntent = new Intent(this, Dashboard.class);
                startActivity(myIntent);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        });
    }
//Get Request Travel Agents 
    private void getRequestTravelAgents( ) {
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);

            // Generate a StringRequest using the GET HTTP method.
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    response -> {
                        // Handle the response here
                        AutoCompleteTextView autoCompleteTextView = findViewById(R.id.autoCompleteTextView);

                        try {
                            JSONArray jsonArray = new JSONArray(response);
                            ArrayList<String> stringList = new ArrayList<>();
                            for (int i = 0; i < jsonArray.length(); i++){
                                if(jsonArray.getJSONObject(i).getString("type").contains("travel-agent")){
                                    stringList.add(jsonArray.getJSONObject(i).getString("username"));
                                }
                            }

                            String[] stringArray = stringList.toArray(new String[0]);
                            ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(this ,R.layout.dropdown_item, stringArray);
                            autoCompleteTextView.setAdapter(arrayAdapter);

                            autoCompleteTextView.addTextChangedListener(new TextWatcher() {
                                @Override
                                public void beforeTextChanged(CharSequence s, int start, int count, int after) { }
                                @Override
                                public void onTextChanged(CharSequence s, int start, int before, int count) { }

                                @Override
                                public void afterTextChanged(Editable s) {
                                    assistantName = s.toString();
                                    btn.setEnabled(!s.toString().isEmpty());
                                }
                            });

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    },
                    error -> {
                        // Manage errors in this section.
                        if (error.networkResponse != null) {
                            Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            Log.e(TAG, "Error Response body: " + responseBody);
                            Toast.makeText(getApplicationContext(), responseBody, Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                public Map<String, String> getHeaders() {
                    // Specify your custom headers here
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Content-Type", "application/json");
                    //SET X-API-KEY TO AUTHORIZE FROM THE SERVER
                    //GET IT FROM LOCAL STORAGE
                    headers.put("X-Api-Key", myPreferences.getString("accessToken", null));
                    return headers;
                }
            };

            // Include the request in the RequestQueue.
            mRequestQueue.add(stringRequest);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void submitRequest() throws JSONException {
       // Initialization of the RequestQueue is complete;
        RequestQueue mRequestQueue = Volley.newRequestQueue(this);

        // Specify the payload or data structure.
        JSONObject jsonBody = new JSONObject();
        jsonBody.put("assistant", assistantName);
        jsonBody.put("email", myPreferences.getString("email", null));
        jsonBody.put("username", myPreferences.getString("username", null));
        jsonBody.put("phone", myPreferences.getString("phone", null));
        jsonBody.put("train", train);
        jsonBody.put("start", start);
        jsonBody.put("departure", departure);
        jsonBody.put("time", time);
        jsonBody.put("status", "ACTIVE");

        // Generate a JsonObjectRequest utilizing the POST method, specifying the URL, JSON object, and response/error listeners.
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, requestUrl, jsonBody,
                response -> {
                    // Manage the responses
                },
                error -> {
                    // Handle errors here
                    if (error.networkResponse != null) {
                        Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                        String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                        Log.e(TAG, "Error Response body: " + responseBody);
                        Toast.makeText(this, responseBody, Toast.LENGTH_LONG).show();
                    }

                }) {
            @Override
            public Map<String, String> getHeaders() {
                // Define your custom headers here
                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Content-Type", "application/json");
                headers.put("X-Api-Key", myPreferences.getString("accessToken", null));
                return headers;
            }
        };

        // Add the request to the RequestQueue
        mRequestQueue.add(jsonObjectRequest);

    }

}
