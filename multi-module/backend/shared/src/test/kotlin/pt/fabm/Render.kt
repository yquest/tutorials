package pt.fabm

import org.junit.jupiter.api.Test
import pt.fabm.main.*

class Render {
    @Test
    fun renderMainClient(){
        val buffer = MainClient().render()
        print(buffer)
    }
    @Test
    fun renderAppClient(){
        val buffer = AppClient().render()
        print(buffer)
    }
    @Test
    fun renderCardClient(){
        val buffer = CardClient().render()
        print(buffer)
    }
    @Test
    fun renderNavigationClient(){
        val buffer = NavigationClient().render()
        print(buffer)
    }
}