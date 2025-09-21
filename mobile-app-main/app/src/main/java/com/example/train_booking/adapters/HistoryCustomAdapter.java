package com.example.train_booking.adapters;

import static android.content.ContentValues.TAG;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.RequiresApi;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.train_booking.HistoryActivity;
import com.example.train_booking.R;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;


public class HistoryCustomAdapter extends BaseAdapter {
    Context context;
    JSONArray historyList;
    LayoutInflater inflter;

    //use local storage
    SharedPreferences myPreferences;

    private final String url = "http://10.0.2.2:5101/api/booking/cancel/";

    //Format Dates
    SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm", Locale.US);
    SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy - MM - dd HH:mm a", Locale.US);

    public HistoryCustomAdapter(Context applicationContext, JSONArray historyList) {
        this.context = applicationContext;
        this.historyList = historyList;
        inflter = (LayoutInflater.from(applicationContext));
        myPreferences = PreferenceManager.getDefaultSharedPreferences(context);
    }

    @Override
    public int getCount() {
        return historyList.length();
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
    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = inflter.inflate(R.layout.activity_history_listview, null);
        TextView train = view.findViewById(R.id.historyTextViewTrainName);
        TextView start = view.findViewById(R.id.historyTextViewStart);
        TextView time = view.findViewById(R.id.historyTextViewTime);
        TextView bookedAt = view.findViewById(R.id.historyTextViewBookedDate);
        TextView warn = view.findViewById(R.id.historyTextViewCancelWarn);
        Button btn = view.findViewById(R.id.cancelBtn);

        try {
            String label;
            String payloadLbl;
            String warnLbl;

            if(historyList.getJSONObject(i).getString("status").contains("ACTIVE")){
                label = "❌ Cancel";
                payloadLbl = "CANCELLED";
                warnLbl = "cancel.";
            } else {
                label = "➕ Revoke";
                payloadLbl = "ACTIVE";
                warnLbl = "revoke.";
            }

            // Get the current date and time
            LocalDateTime currentDate = LocalDateTime.now();

            // Parse the input date
            String dateInputString = historyList.getJSONObject(i).getString("createdAt");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yyyy h:mm:ss a");
            LocalDateTime createdAt = LocalDateTime.parse(dateInputString, formatter);

            int daysDiff = (int) java.time.Duration.between(createdAt, currentDate).toDays();

            //Restrict the cancellation
            if(daysDiff <= 5) {
                warn.setText("Wait at least 5 days to cancel.");
                btn.setEnabled(false);
            } else {
                warn.setText("Yo can " + warnLbl);
                btn.setEnabled(true);
            }

            Date date = inputFormat.parse(historyList.getJSONObject(i).getString("time"));
            String formattedDate = outputFormat.format(date);
            time.setText("Time -> " + formattedDate);
            train.setText(historyList.getJSONObject(i).get("train").toString() + " - " +  historyList.getJSONObject(i).get("status").toString());
            start.setText(historyList.getJSONObject(i).getString("start") + " to " + historyList.getJSONObject(i).getString("departure"));
            btn.setText(label);
            bookedAt.setText("Booked at " + historyList.getJSONObject(i).getString("createdAt"));

            btn.setOnClickListener(v -> {
                try {
                    //CANCEL OR ACTIVATE BOOKING
                    cancelOrRevokeBooking(historyList.getJSONObject(i).get("id").toString(), payloadLbl);
                    Toast.makeText(context, payloadLbl, Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(context, HistoryActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            });
        } catch (JSONException | ParseException e) {
            e.printStackTrace();
        }

        return view;
    }

    private void cancelOrRevokeBooking(String id, String payloadLbl) {
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(context);

            // Define payload
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("status", payloadLbl);

            // Create a JsonObjectRequest with POST method, URL, JSON object, and response/error listeners
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, url + id, jsonBody,
                    response -> {
                        // Handle the response here
                        System.out.println("YYYY" + response);

                    },
                    error -> {
                        // Handle errors
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
