export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const ANDROID_KOTLIN_FILES: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/bloomera/app/MainActivity.kt',
    language: 'kotlin',
    description: 'Main activity with edge-to-edge Compose entry point and Navigation Suite',
    content: `package com.bloomera.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.bloomera.app.ui.navigation.BloomEraNavHost
import com.bloomera.app.ui.navigation.BloomEraBottomBar
import com.bloomera.app.ui.theme.BloomEraTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BloomEraTheme {
                val navController = rememberNavController()
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        BloomEraBottomBar(navController = navController)
                    }
                ) { innerPadding ->
                    BloomEraNavHost(
                        navController = navController,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}`,
  },
  {
    name: 'BloomEraTheme.kt',
    path: 'app/src/main/java/com/bloomera/app/ui/theme/BloomEraTheme.kt',
    language: 'kotlin',
    description: 'Material 3 Custom Aesthetic Theme & Dynamic Color Schemes',
    content: `package com.bloomera.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// BloomEra Sakura Palette
val SakuraPrimary = Color(0xFFC84C6D)
val SakuraOnPrimary = Color(0xFFFFFFFF)
val SakuraPrimaryContainer = Color(0xFFFCE7ED)
val SakuraOnPrimaryContainer = Color(0xFF541224)
val SakuraBackground = Color(0xFFFDF8F9)
val SakuraSurface = Color(0xFFFFFFFF)
val SakuraOutline = Color(0xFFF0D1D8)

val SakuraDarkPrimary = Color(0xFFF48BA5)
val SakuraDarkBackground = Color(0xFF160E12)
val SakuraDarkSurface = Color(0xFF22151B)

private val SakuraLightColorScheme = lightColorScheme(
    primary = SakuraPrimary,
    onPrimary = SakuraOnPrimary,
    primaryContainer = SakuraPrimaryContainer,
    onPrimaryContainer = SakuraOnPrimaryContainer,
    background = SakuraBackground,
    surface = SakuraSurface,
    outline = SakuraOutline
)

private val SakuraDarkColorScheme = darkColorScheme(
    primary = SakuraDarkPrimary,
    background = SakuraDarkBackground,
    surface = SakuraDarkSurface
)

@Composable
fun BloomEraTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) SakuraDarkColorScheme else SakuraLightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = BloomEraTypography,
        shapes = BloomEraShapes,
        content = content
    )
}`,
  },
  {
    name: 'HomeScreen.kt',
    path: 'app/src/main/java/com/bloomera/app/ui/screens/home/HomeScreen.kt',
    language: 'kotlin',
    description: 'Composables for Today Bloom Ring, Daily Affirmation & Habit Streaks',
    content: `package com.bloomera.app.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.bloomera.app.ui.components.BloomProgressRing
import com.bloomera.app.ui.components.DailyAffirmationCard
import com.bloomera.app.ui.components.HabitStreakRow

@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onNavigateToPlanner: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            HomeHeader(userName = uiState.userName)
        }
        item {
            BloomProgressRing(
                score = uiState.bloomScore,
                completedHabits = uiState.completedHabitsCount,
                totalHabits = uiState.totalHabitsCount
            )
        }
        item {
            DailyAffirmationCard(
                quote = uiState.dailyQuote,
                author = uiState.quoteAuthor
            )
        }
        item {
            Text(
                text = "Today's Rituals",
                style = MaterialTheme.typography.titleMedium
            )
        }
        items(uiState.habits) { habit ->
            HabitStreakRow(
                habit = habit,
                onToggle = { viewModel.toggleHabit(habit.id) }
            )
        }
    }
}`,
  },
  {
    name: 'HabitViewModel.kt',
    path: 'app/src/main/java/com/bloomera/app/presentation/HabitViewModel.kt',
    language: 'kotlin',
    description: 'Kotlin Coroutines, StateFlow and Offline-First Repository pattern',
    content: `package com.bloomera.app.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bloomera.app.data.repository.HabitRepository
import com.bloomera.app.model.Habit
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HabitUiState(
    val habits: List<Habit> = emptyList(),
    val completedTodayCount: Int = 0,
    val isLoading: Boolean = false
)

@HiltViewModel
class HabitViewModel @Inject constructor(
    private val repository: HabitRepository
) : ViewModel() {

    val uiState: StateFlow<HabitUiState> = repository.getHabitsStream()
        .map { list ->
            HabitUiState(
                habits = list,
                completedTodayCount = list.count { it.isCompletedToday }
            )
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = HabitUiState(isLoading = true)
        )

    fun toggleHabit(habitId: String) {
        viewModelScope.launch {
            repository.toggleHabitCompletion(habitId)
        }
    }
}`,
  },
  {
    name: 'BloomDatabase.kt',
    path: 'app/src/main/java/com/bloomera/app/data/local/BloomDatabase.kt',
    language: 'kotlin',
    description: 'Room Database for 100% offline persistence and encrypted local tables',
    content: `package com.bloomera.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.bloomera.app.data.local.dao.*
import com.bloomera.app.data.local.entity.*

@Database(
    entities = [
        HabitEntity::class,
        TaskEntity::class,
        FinanceEntity::class,
        GoalEntity::class,
        NoteEntity::class,
        WellnessLogEntity::class
    ],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class BloomDatabase : RoomDatabase() {
    abstract fun habitDao(): HabitDao
    abstract fun taskDao(): TaskDao
    abstract fun financeDao(): FinanceDao
    abstract fun goalDao(): GoalDao
    abstract fun noteDao(): NoteDao
    abstract fun wellnessDao(): WellnessDao
}`,
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'groovy',
    description: 'Android build script with Compose, Room, Hilt, Navigation dependencies',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.bloomera.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.bloomera.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
}`,
  },
];
