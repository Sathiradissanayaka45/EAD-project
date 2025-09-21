package com.example.train_booking.adapters;

import static android.content.ContentValues.TAG;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.train_booking.Dashboard;
import com.example.train_booking.R;
import com.example.train_booking.RequestActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/*
    ADAPTER CLASS FOR TRAIN MANAGEMENT
 */

public class TrainCustomAdapter extends BaseAdapter {
    Context context;
    JSONArray trainList;
    int myReservations;
    LayoutInflater inflter;

    //use local storage
    SharedPreferences myPreferences;

    private final String url = "http://10.0.2.2:5101/api/booking/my/";

    //Format Dates
    SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm", Locale.US);
    SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy - MM - dd HH:mm a", Locale.US);

    public TrainCustomAdapter(Context applicationContext, JSONArray trainList, int myReservations) {
        this.context = applicationContext;
        this.trainList = trainList;
        this.myReservations = myReservations;
        inflter = (LayoutInflater.from(applicationContext));
        myPreferences = PreferenceManager.getDefaultSharedPreferences(context);
    }

    @Override
    public int getCount() {
        return trainList.length();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = inflter.inflate(R.layout.activity__train_listview, null);
        TextView username = view.findViewById(R.id.trainTextViewUsername);
        TextView start = view.findViewById(R.id.trainTextViewStart);
        TextView time = view.findViewById(R.id.trainTextViewTime);
        TextView warn = view.findViewById(R.id.trainTextViewWarn);
        Button btn = view.findViewById(R.id.trainBtn);
        Button requestBtn = view.findViewById(R.id.requestBtn);

        btn.setOnClickListener(v -> {
            try {
                bookTrain(trainList.getJSONObject(i));
                Toast.makeText(context, "Successfully Booked.", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(context, Dashboard.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        });

        try {
            //Restrict to 4 reservations
            if(myReservations >= 4) {
                btn.setEnabled(false);
                requestBtn.setEnabled(false);
                warn.setText("WARN: Maximum 4 reservations reached.");
            } else {
                btn.setEnabled(true);
                requestBtn.setEnabled(true);
                warn.setText("My Reservations : " + myReservations);
            };
            Date date = inputFormat.parse(trainList.getJSONObject(i).getString("time"));
            String formattedDate = outputFormat.format(date);
            username.setText(trainList.getJSONObject(i).getString("name"));
            start.setText(trainList.getJSONObject(i).getString("start") + " to " + trainList.getJSONObject(i).getString("departure"));
            time.setText(formattedDate);

            //CHANGE THE CONTEXT TO REQUEST ASSISTANT
            requestBtn.setOnClickListener(v -> {
                Intent intent = new Intent(context, RequestActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try {
                    intent.putExtra("train", trainList.getJSONObject(i).getString("name"));
                    intent.putExtra("start", trainList.getJSONObject(i).getString("start"));
                    intent.putExtra("time", formattedDate);
                    intent.putExtra("departure", trainList.getJSONObject(i).getString("departure"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                intent.putExtra("secondKeyName","SecondKeyValue");
                context.startActivity(intent);
            });

        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }
        return view;
    }

    private void bookTrain(JSONObject obj) {
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(context);

            // Define payload
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("id", myPreferences.getString("id", null));
            jsonBody.put("nic", myPreferences.getString("nic", null));
            jsonBody.put("username", myPreferences.getString("username", null));
            jsonBody.put("email", myPreferences.getString("email", null));
            jsonBody.put("phone", myPreferences.getString("phone", null));
            jsonBody.put("address", myPreferences.getString("address", null));

            String id = obj.getString("id");
            String name = obj.getString("name");
            String time = obj.getString("time");
            String start = obj.getString("start");
            String departure = obj.getString("departure");

            String urlPath = id + "/" + name + "/" + time + "/" + start + "/" + departure;

            // Create a JsonObjectRequest with POST method, URL, JSON object, and response/error listeners
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url + urlPath, jsonBody,
                    response -> {
                        // Handle the response here
                        System.out.println("YYYY" + response);
                    },
                    error -> {
                        // Handle errors here
                        if (error.networkResponse != null) {
                            Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            Log.e(TAG, "Error Response body: " + responseBody);
                            Toast.makeText(context, responseBody, Toast.LENGTH_LONG).show();
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

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}