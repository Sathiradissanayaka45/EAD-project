package com.example.train_booking;

import static android.content.ContentValues.TAG;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.train_booking.adapters.TrainCustomAdapter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
    DASHBOARD ACTIVITY - Handle the train management
 */

public class Dashboard extends AppCompatActivity {

    //use local storage
    SharedPreferences myPreferences;

    private final String url = "http://10.0.2.2:5101/api/train/schedules";
    private final String deactivateUrl = "http://10.0.2.2:5101/api/account/";

    ListView listView;
    TextView emptyText;
    Button historyBtn;
    Button logoutBtn;
    Button deactivateBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        myPreferences = PreferenceManager.getDefaultSharedPreferences(Dashboard.this);
        getTrainSchedules();

        historyBtn = findViewById(R.id.historyBtn);
        logoutBtn = findViewById(R.id.logoutBtn);
        deactivateBtn = findViewById(R.id.deactivateBtn);

        historyBtn.setOnClickListener(view -> {
            Intent intent = new Intent(Dashboard.this, HistoryActivity.class);
            startActivity(intent);
        });

        logoutBtn.setOnClickListener(view -> {
            SharedPreferences.Editor myEditor;
            myEditor = myPreferences.edit();
            myEditor.clear();
            myEditor.apply();
            Intent intent = new Intent(Dashboard.this, LoginActivity.class);
            startActivity(intent);
        });

        deactivateBtn.setOnClickListener(view -> {
            deactivateAccount();
            Toast.makeText(this, "Account Deactivated" , Toast.LENGTH_LONG);
            Intent intent = new Intent(Dashboard.this, LoginActivity.class);
            startActivity(intent);
        });
    }

    private void getTrainSchedules( ) {
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);

            // Create a StringRequest with GET method
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    response -> {
                        // Handle the response here
                        listView = findViewById(R.id.listView);
                        emptyText = findViewById(R.id.emptyTextViewDashboard);
                        try {
                            //CONVERT STRING RESPONSE TO JSON ARRAY
                            JSONArray trainList = new JSONArray(response);
                            JSONArray remakeTrainList =  new JSONArray();
                            int myReservations = 0;

                            //GET ONLY ACTIVE AND PUBLISHED TRAINS
                            for (int i = 0; i < trainList.length(); i++) {
                                if (trainList.getJSONObject(i).getString("status").equals("ACTIVE & PUBLISHED")) {
                                    remakeTrainList.put(trainList.getJSONObject(i));
                                    JSONArray reservations = new JSONArray(trainList.getJSONObject(i).getString("reservations"));
                                    for (int x = 0; x < reservations.length(); x++){
                                        //SET PARTICULAR USER RESERVATIONS
                                        if(reservations.getJSONObject(x).getString("userId").contains(myPreferences.getString("id", null))){
                                            myReservations = myReservations + 1;
                                        }
                                    }
                                }
                            }

                            // Convert JSONArray to List
                            List<JSONObject> list = new ArrayList<>();
                            for (int i = 0; i < remakeTrainList.length(); i++) {
                                list.add(remakeTrainList.getJSONObject(i));
                            }

                            // Sort the list based on "updatedAt" property in descending order
                            Collections.sort(list, new Comparator<JSONObject>() {
                                private final SimpleDateFormat sdf = new SimpleDateFormat("MM/DD/yyyy HH:mm:ss a");

                                @Override
                                public int compare(JSONObject o1, JSONObject o2) {
                                    String updatedAt1 = o1.optString("updatedAt");
                                    String updatedAt2 = o2.optString("updatedAt");

                                    try {
                                        Date date1 = sdf.parse(updatedAt1);
                                        Date date2 = sdf.parse(updatedAt2);

                                        // Sort in descending order
                                        return date2.compareTo(date1);
                                    } catch (ParseException e) {
                                        e.printStackTrace();
                                        return 0;
                                    }
                                }
                            });

                            // Convert the sorted list back to JSONArray
                            JSONArray sortedJsonArray = new JSONArray(list);
                            if(sortedJsonArray.length() == 0) {
                                emptyText.setText("No train schedules found.");
                            } else {
                                emptyText.setText("");
                                TrainCustomAdapter trainCustomAdapter = new TrainCustomAdapter(getApplicationContext(), sortedJsonArray, myReservations);
                                listView.setAdapter(trainCustomAdapter);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    },
                    error -> {
                        // Handle errors here
                        if (error.networkResponse != null) {
                            Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            Log.e(TAG, "Error Response body: " + responseBody);
                            Toast.makeText(getApplicationContext(), responseBody, Toast.LENGTH_LONG).show();
                        }
                    }) {
                @Override
                public Map<String, String> getHeaders() {
                    // Define your custom headers here
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Content-Type", "application/json");
                    //SET X-API-KEY TO AUTHORIZE FROM THE SERVER
                    //GET IT FROM LOCAL STORAGE
                    headers.put("X-Api-Key", myPreferences.getString("accessToken", null));
                    return headers;
                }
            };

            // Add the request to the RequestQueue
            mRequestQueue.add(stringRequest);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deactivateAccount( ){
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);

            // Define payload
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("status", "DEACTIVATED");

            System.out.println(jsonBody);

            // Create a JsonObjectRequest with POST method, URL, JSON object, and response/error listeners
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, deactivateUrl + myPreferences.getString("id", null), jsonBody,
                    response -> {
                        // Handle the response here
                    },
                    error -> {

                        // Handle errors here
                        if (error.networkResponse != null) {
                            Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            Log.e(TAG, "Error Response body: " + responseBody);
                            Toast.makeText(getApplicationContext(), responseBody, Toast.LENGTH_LONG).show();
                        }

                    }) {
                @Override
                public Map<String, String> getHeaders() {
                    // Define your custom headers here
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Content-Type", "application/json");
                    //SET X-API-KEY TO AUTHORIZE FROM THE SERVER
                    //GET IT FROM LOCAL STORAGE
                    headers.put("X-Api-Key", myPreferences.getString("accessToken", null));
                    return headers;
                }
            };

            // Add the request to the RequestQueue
            mRequestQueue.add(jsonObjectRequest);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}