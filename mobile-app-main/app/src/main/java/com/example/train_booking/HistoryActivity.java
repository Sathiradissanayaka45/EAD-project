package com.example.train_booking;

import static android.content.ContentValues.TAG;
import androidx.appcompat.app.AppCompatActivity;
import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.train_booking.adapters.HistoryCustomAdapter;
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
    HISTORY ACTIVITY - Handle the booking management
 */

public class HistoryActivity extends AppCompatActivity {

    //use local storage
    SharedPreferences myPreferences;

    // API URL for booking history
    private final String url = "http://10.0.2.2:5101/api/booking/user/";

    // ListView to display booking history
    ListView listView;

    // TextView to display a message when the history is empty
    private TextView emptyTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        // Initialize SharedPreferences for storing user preferences
        myPreferences = PreferenceManager.getDefaultSharedPreferences(HistoryActivity.this);
        getBookingHistory();
    }

    // Method to fetch and display booking history
    private void getBookingHistory( ) {
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);
            emptyTextView = findViewById(R.id.emptyTextViewHistory);

            // Create a StringRequest with GET method
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url + myPreferences.getString("username", null),
                    response -> {
                        // Handle the response here
                        listView = findViewById(R.id.listViewHistory);

                        //CONVERT STRING RESPONSE TO JSON ARRAY
                        try {
                            JSONArray historyList = new JSONArray(response);

                            // Convert JSONArray to List
                            List<JSONObject> list = new ArrayList<>();
                            for (int i = 0; i < historyList.length(); i++) {
                                list.add(historyList.getJSONObject(i));
                            }

                            // Sort the list based on "updatedAt" property in descending order
                            Collections.sort(list, new Comparator<JSONObject>() {
                                @SuppressLint("SimpleDateFormat")
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
                            if(sortedJsonArray.length() == 0){
                                emptyTextView.setText("No recent booking history found.");
                            } else {
                                emptyTextView.setText("");
                                HistoryCustomAdapter historyCustomAdapter = new HistoryCustomAdapter(getApplicationContext(), sortedJsonArray);
                                listView.setAdapter(historyCustomAdapter);
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
}